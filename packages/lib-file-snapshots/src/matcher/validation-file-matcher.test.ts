import path from "node:path";
import { type TestContext, expect, test } from "vitest";

import { JsonSerializer } from "../serializers/json-serializer";
import { TextSerializer } from "../serializers/text-serializer";
import type { ValidationFileMatcherResult } from "../types/matcher";
import { normalizeFileName } from "../utils/file";
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
  const {
    actual,
    expected,
    actualFile,
    validationFile,
    message,
    isValidationFileMissing,
  } = matcherResult;
  const { testFileName, testName } = resolveTestContext(context);
  const normalizedTestName = normalizeFileName(testName);

  const fileExtension = path.extname(validationFile);
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
  await expect(actualFile).toMatchFileSnapshot(
    path.join(snapshotDir, "actual_file.txt"),
  );
  await expect(validationFile).toMatchFileSnapshot(
    path.join(snapshotDir, "validation_file.txt"),
  );
  await expect(message()).toMatchFileSnapshot(
    path.join(snapshotDir, "message.txt"),
  );
  await expect(isValidationFileMissing).toMatchFileSnapshot(
    path.join(snapshotDir, "isValidationFileMissing.txt"),
  );
}

test("when validation file is missing, creates validation file with marker", async (context) => {
  cleanTmpDir();

  await snapshotMatcherResult(
    context,
    new ValidationFileMatcher({
      validationDir: path.join(TMP_DIR, "validation"),
      outputDir: path.join(TMP_DIR, "output"),
      testPath: "./src/tests/feature.test.ts",
      titlePath: ["validation file", "missing"],
      serializer: new TextSerializer(),
    }).matchFileSnapshot("value"),
  );
});

test("when validation file exists, does not recreate validation file", async (context) => {
  await snapshotMatcherResult(
    context,
    new ValidationFileMatcher({
      testPath: "./src/tests/feature.test.ts",
      titlePath: ["validation file", "existing"],
      serializer: new JsonSerializer(),
    }).matchFileSnapshot(["value"]),
  );
});

test("uses naming strategy file by default", async (context) => {
  cleanTmpDir();

  await snapshotMatcherResult(
    context,
    new ValidationFileMatcher({
      validationDir: path.join(TMP_DIR, "validation"),
      outputDir: path.join(TMP_DIR, "output"),
      testPath: "./src/tests/feature.test.ts",
      titlePath: ["file"],
      name: "name",
      serializer: new TextSerializer(),
    }).matchFileSnapshot("value"),
  );
});

test("when naming strategy is file, appends name to validation file path", async (context) => {
  cleanTmpDir();

  await snapshotMatcherResult(
    context,
    new ValidationFileMatcher({
      validationDir: path.join(TMP_DIR, "validation"),
      outputDir: path.join(TMP_DIR, "output"),
      testPath: "./src/tests/feature.test.ts",
      titlePath: ["file"],
      name: "name",
      namingStrategy: "file",
      serializer: new TextSerializer(),
    }).matchFileSnapshot("value"),
  );
});

test("when naming strategy is fileSuffix, appends name to validation file name", async (context) => {
  cleanTmpDir();

  await snapshotMatcherResult(
    context,
    new ValidationFileMatcher({
      validationDir: path.join(TMP_DIR, "validation"),
      outputDir: path.join(TMP_DIR, "output"),
      testPath: "./src/tests/feature.test.ts",
      titlePath: ["file"],
      name: "name",
      namingStrategy: "fileSuffix",
      serializer: new TextSerializer(),
    }).matchFileSnapshot("value"),
  );
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
