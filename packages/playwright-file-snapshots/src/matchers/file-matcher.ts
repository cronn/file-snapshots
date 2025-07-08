import {
  type SnapshotSerializer,
  ValidationFileMatcher,
} from "@cronn/lib-file-snapshots";
import {
  type ExpectMatcherState,
  type MatcherReturnType,
  expect as baseExpect,
  test,
} from "@playwright/test";
import type {
  PlaywrightMatchValidationFileOptions,
  PlaywrightValidationFileMatcherConfig,
} from "./types";
import { parseTestInfo } from "./utils";

interface MatchValidationFileParams {
  actual: unknown;
  name: string;
  serializer: SnapshotSerializer;
  config: PlaywrightValidationFileMatcherConfig;
  options: PlaywrightMatchValidationFileOptions;
  matcherState: ExpectMatcherState;
}

export function matchValidationFile(
  params: MatchValidationFileParams,
): MatcherReturnType {
  const { actual, serializer, config, options, matcherState } = params;
  const { isNot } = matcherState;

  if (isNot) {
    throw new Error("Matcher negation is not supported");
  }

  const { filterSteps, ...matcherConfig } = config;
  const { titlePath, testPath } = parseTestInfo(test.info(), filterSteps);
  let pass: boolean;

  const { name } = options;
  const matcherResult = new ValidationFileMatcher(
    matcherConfig,
  ).matchFileSnapshot(actual, {
    testPath,
    titlePath,
    name,
    serializer,
  });

  try {
    baseExpect.soft(matcherResult.actual).toBe(matcherResult.expected);
    pass = true;
  } catch (e: unknown) {
    pass = false;
  }

  return {
    name,
    pass,
    message: matcherResult.message,
    expected: matcherResult.expected,
    actual: matcherResult.actual,
  };
}
