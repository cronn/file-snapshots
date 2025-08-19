import type { ExpectationResult, MatcherState } from "@vitest/expect";

import type {
  FilePathResolver,
  SnapshotSerializer,
} from "@cronn/lib-file-snapshots";
import {
  ValidationFileMatcher,
  resolveNameAsFile,
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

  const {
    validationDir,
    outputDir,
    testDir = ".",
    resolveFilePath: configuredFilePathResolver,
  } = config;
  const { name, resolveFilePath: localFilePathResolver } = options;
  const resolveFilePath: FilePathResolver =
    localFilePathResolver ?? configuredFilePathResolver ?? resolveNameAsFile;
  const filePath = resolveFilePath({
    testPath: parseTestPath(testPath, testDir),
    titlePath: parseTestName(currentTestName),
    name,
  });
  const matcherResult = new ValidationFileMatcher({
    validationDir,
    outputDir,
    filePath,
    serializer,
  }).matchFileSnapshot(received);
  matcherResult.writeFileSnapshots();

  return {
    pass: equals(matcherResult.actual, matcherResult.expected, [], true),
    message: matcherResult.message,
    actual: matcherResult.actual,
    expected: matcherResult.expected,
  };
}
