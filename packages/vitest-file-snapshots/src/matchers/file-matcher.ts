import type { ExpectationResult, MatcherState } from "@vitest/expect";

import {
  type SnapshotSerializer,
  ValidationFileMatcher,
} from "@cronn/lib-file-snapshots";

import type {
  VitestMatchValidationFileOptions,
  VitestValidationFileMatcherConfig,
} from "./types";
import { parseTestName, parseTestPath } from "./utils";

interface MatchValidationFileParams {
  received: unknown;
  serializer: SnapshotSerializer;
  config: VitestValidationFileMatcherConfig;
  options: VitestMatchValidationFileOptions;
  matcherState: MatcherState;
}

export function matchValidationFile(
  params: MatchValidationFileParams,
): ExpectationResult {
  const { received, serializer, config, options, matcherState } = params;
  const { currentTestName, testPath, equals, isNot } = matcherState;

  if (currentTestName === undefined) {
    throw new Error("Missing test name");
  }

  if (testPath === undefined) {
    throw new Error("Missing test path");
  }

  if (isNot) {
    throw new Error("Matcher negation is not supported");
  }

  const { testDir = ".", ...matcherConfig } = config;
  const { name, namingStrategy } = options;
  const matcherResult = new ValidationFileMatcher(
    matcherConfig,
  ).matchFileSnapshot(received, {
    testPath: parseTestPath(testPath, testDir),
    titlePath: parseTestName(currentTestName),
    name,
    namingStrategy,
    serializer,
  });

  return {
    pass: equals(matcherResult.actual, matcherResult.expected, [], true),
    message: matcherResult.message,
    actual: matcherResult.actual,
    expected: matcherResult.expected,
  };
}
