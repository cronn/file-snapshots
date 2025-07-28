import type { ExpectMatcherUtils } from "@playwright/test";
import {
  type ExpectMatcherState,
  type MatcherReturnType,
  expect as baseExpect,
  test,
} from "@playwright/test";

import {
  type SnapshotSerializer,
  ValidationFileMatcher,
  type ValidationFileMatcherResult,
} from "@cronn/lib-file-snapshots";

import { waitForTimer } from "../utils/timer";

import {
  RepeatableSnapshot,
  StaticSnapshot,
  createSnapshotInstance,
} from "./snapshot";
import type {
  PlaywrightMatchValidationFileOptions,
  PlaywrightValidationFileMatcherConfig,
} from "./types";
import { parseTestInfo } from "./utils";

const UPDATE_DELAY = 250;

interface MatchValidationFileParams {
  actual: unknown;
  matcherName: string;
  serializer: SnapshotSerializer;
  config: PlaywrightValidationFileMatcherConfig;
  options: PlaywrightMatchValidationFileOptions;
  matcherState: ExpectMatcherState;
}

export async function matchValidationFile(
  params: MatchValidationFileParams,
): Promise<MatcherReturnType> {
  const { matcherName, actual, serializer, config, options, matcherState } =
    params;
  const { timeout, isNot, utils } = matcherState;

  if (isNot) {
    throw new Error("Matcher negation is not supported");
  }

  const { validationDir, outputDir, filterSteps } = config;
  const { titlePath, testPath, updateSnapshots } = parseTestInfo(
    test.info(),
    filterSteps,
  );

  const { name, namingStrategy } = options;
  const matcher = new ValidationFileMatcher({
    validationDir,
    outputDir,
    testPath,
    titlePath,
    name,
    namingStrategy,
    serializer,
  });

  const testTimeout = options.timeout ?? timeout;
  const updateDelay = Math.min(testTimeout, UPDATE_DELAY);
  const snapshot = createSnapshotInstance(actual);

  const isUpdate = matcher.isValidationFileMissing || updateSnapshots;
  if (isUpdate && snapshot instanceof RepeatableSnapshot) {
    await waitForTimer(updateDelay);
  }

  while (true) {
    const currentActual = await snapshot.getValue();
    const matcherResult = matcher.matchFileSnapshot(currentActual);

    let pass: boolean;

    try {
      baseExpect(matcherResult.actual).toBe(matcherResult.expected);
      pass = true;
    } catch {
      pass = false;
    }

    const skipRetry = isUpdate || snapshot instanceof StaticSnapshot;
    const stopRetry =
      pass ||
      (snapshot instanceof RepeatableSnapshot &&
        snapshot.isTimeoutExceeded(testTimeout));
    if (skipRetry || stopRetry) {
      matcherResult.writeFileSnapshots();
      return buildMatcherReturnType({
        matcherName,
        pass,
        matcherResult,
        utils,
      });
    }

    await snapshot.waitForNextRetry();
  }
}

interface BuildMatcherReturnTypeParams {
  matcherName: string;
  pass: boolean;
  matcherResult: ValidationFileMatcherResult;
  utils: ExpectMatcherUtils;
}

function buildMatcherReturnType(
  params: BuildMatcherReturnTypeParams,
): MatcherReturnType {
  const { matcherName, pass, matcherResult, utils } = params;

  return {
    name: matcherName,
    pass,
    message: () =>
      printParagraphs([
        utils.matcherHint(matcherName, "actual", ""),
        matcherResult.message(),
        utils.printDiffOrStringify(
          matcherResult.expected,
          matcherResult.actual,
          "Validation file",
          "Output file",
          false,
        ),
      ]),
    expected: matcherResult.expected,
    actual: matcherResult.actual,
  };
}

function printParagraphs(lines: Array<string>): string {
  return lines.join("\n\n");
}
