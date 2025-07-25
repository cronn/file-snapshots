import {
  type ExpectMatcherState,
  type MatcherReturnType,
  expect as baseExpect,
  test,
} from "@playwright/test";

import {
  type SnapshotSerializer,
  ValidationFileMatcher,
} from "@cronn/lib-file-snapshots";

import type {
  PlaywrightMatchValidationFileOptions,
  PlaywrightValidationFileMatcherConfig,
} from "./types";
import { parseTestInfo } from "./utils";

interface MatchValidationFileParams {
  actual: unknown;
  matcherName: string;
  serializer: SnapshotSerializer;
  config: PlaywrightValidationFileMatcherConfig;
  options: PlaywrightMatchValidationFileOptions;
  matcherState: ExpectMatcherState;
}

export function matchValidationFile(
  params: MatchValidationFileParams,
): MatcherReturnType {
  const { matcherName, actual, serializer, config, options, matcherState } =
    params;
  const { isNot, utils } = matcherState;

  if (isNot) {
    throw new Error("Matcher negation is not supported");
  }

  const { validationDir, outputDir, filterSteps } = config;
  const { titlePath, testPath } = parseTestInfo(test.info(), filterSteps);
  let pass: boolean;

  const { name, namingStrategy } = options;
  const matcherResult = new ValidationFileMatcher({
    validationDir,
    outputDir,
    testPath,
    titlePath,
    name,
    namingStrategy,
    serializer,
  }).matchFileSnapshot(actual);

  try {
    baseExpect(matcherResult.actual).toBe(matcherResult.expected);
    pass = true;
  } catch {
    pass = false;
  }

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
          "Actual file",
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
