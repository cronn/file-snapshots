import path from "node:path";
import { type TestContext, expect, test } from "vitest";

import { JsonSerializer } from "../serializers/json-serializer";
import { TextSerializer } from "../serializers/text-serializer";
import type { ValidationFileMatcherResult } from "../types/matcher";
import { normalizeFileName, readSnapshotFile } from "../utils/file";
import {
  FailingSerializer,
  SNAPSHOTS_DIR,
  TMP_DIR,
  cleanTmpDir,
  resolveTestContext,
} from "../utils/test";

import { ValidationFileMatcher } from "./validation-file-matcher";

async function snapshotMatcherResult(
  context: TestContext,
  matcherResult: ValidationFileMatcherResult,
): Promise<void> {
  const { actual, expected, outputFilePath, validationFilePath, message } =
    matcherResult;
  const { testFileName, testName } = resolveTestContext(context);
  const normalizedTestName = normalizeFileName(testName);

  const fileExtension = path.extname(validationFilePath);
  const snapshotDir = path.join(
    ".",
    SNAPSHOTS_DIR,
    testFileName,
    normalizedTestName,
  );
  await expect(actual).toMatchFileSnapshot(
    path.join(snapshotDir, `actual${fileExtension}`),
  );
  await expect(expected).toMatchFileSnapshot(
    path.join(snapshotDir, `expected${fileExtension}`),
  );
  await expect(outputFilePath).toMatchFileSnapshot(
    path.join(snapshotDir, "output_file_path.txt"),
  );
  await expect(validationFilePath).toMatchFileSnapshot(
    path.join(snapshotDir, "validation_file_path.txt"),
  );
  await expect(message()).toMatchFileSnapshot(
    path.join(snapshotDir, "message.txt"),
  );
}

test("when validation file is missing, creates validation file with marker", async (context) => {
  cleanTmpDir();

  const matcher = new ValidationFileMatcher({
    validationDir: path.join(TMP_DIR, "validation"),
    outputDir: path.join(TMP_DIR, "output"),
    testPath: "./src/tests/feature.test.ts",
    titlePath: ["validation file", "missing"],
    serializer: new TextSerializer(),
  });
  expect(matcher.isValidationFileMissing).toBe(true);

  const matcherResult = matcher.matchFileSnapshot("value");
  await snapshotMatcherResult(context, matcherResult);

  matcherResult.writeFileSnapshots();
  expect(readSnapshotFile(matcherResult.validationFilePath)).toBe(
    matcherResult.expected,
  );
  expect(readSnapshotFile(matcherResult.outputFilePath)).toBe(
    matcherResult.actual,
  );
});

test("when validation file exists, does not recreate validation file", async (context) => {
  const matcher = new ValidationFileMatcher({
    testPath: "./src/tests/feature.test.ts",
    titlePath: ["validation file", "existing"],
    serializer: new JsonSerializer(),
  });
  expect(matcher.isValidationFileMissing).toBe(false);

  const matcherResult = matcher.matchFileSnapshot(["value"]);
  await snapshotMatcherResult(context, matcherResult);

  matcherResult.writeFileSnapshots();
  expect(readSnapshotFile(matcherResult.outputFilePath)).toBe(
    matcherResult.actual,
  );
});

test("uses naming strategy file by default", async (context) => {
  const matcherResult = new ValidationFileMatcher({
    validationDir: path.join("custom-validation"),
    outputDir: path.join("custom-output"),
    testPath: "./src/tests/feature.test.ts",
    titlePath: ["file"],
    name: "name",
    serializer: new TextSerializer(),
  }).matchFileSnapshot("value");
  await snapshotMatcherResult(context, matcherResult);
});

test("when naming strategy is file, appends name to validation file path", async (context) => {
  const matcherResult = new ValidationFileMatcher({
    testPath: "./src/tests/feature.test.ts",
    titlePath: ["file"],
    name: "name",
    namingStrategy: "file",
    serializer: new TextSerializer(),
  }).matchFileSnapshot("value");
  await snapshotMatcherResult(context, matcherResult);
});

test("when naming strategy is fileSuffix, appends name to validation file name", async (context) => {
  const matcherResult = new ValidationFileMatcher({
    testPath: "./src/tests/feature.test.ts",
    titlePath: ["file"],
    name: "name",
    namingStrategy: "fileSuffix",
    serializer: new TextSerializer(),
  }).matchFileSnapshot("value");
  await snapshotMatcherResult(context, matcherResult);
});

test("when serializer does not support value, throws error", () => {
  expect(() =>
    new ValidationFileMatcher({
      testPath: "./src/tests/feature.test.ts",
      titlePath: ["error"],
      serializer: new FailingSerializer(),
    }).matchFileSnapshot(["value"]),
  ).toThrowError();
});
