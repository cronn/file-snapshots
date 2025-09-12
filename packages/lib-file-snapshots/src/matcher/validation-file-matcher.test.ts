import path from "node:path";
import { type TestContext, expect, test } from "vitest";

import { JsonSerializer } from "../serializers/json-serializer";
import { TextSerializer } from "../serializers/text-serializer";
import type { ValidationFileMatcherResult } from "../types/matcher";
import { normalizeFileName, readSnapshotFile } from "../utils/file";
import {
  FailingSerializer,
  SNAPSHOTS_DIR,
  createTmpDir,
  maskTmpDir,
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
  await expect(maskTmpDir(outputFilePath)).toMatchFileSnapshot(
    path.join(snapshotDir, "output_file_path.txt"),
  );
  await expect(maskTmpDir(validationFilePath)).toMatchFileSnapshot(
    path.join(snapshotDir, "validation_file_path.txt"),
  );
  await expect(maskTmpDir(message())).toMatchFileSnapshot(
    path.join(snapshotDir, "message.txt"),
  );
}

test("when validation file is missing, creates validation file with marker", async (context) => {
  const tmpDir = createTmpDir();

  const matcher = new ValidationFileMatcher({
    validationDir: path.join(tmpDir, "validation"),
    outputDir: path.join(tmpDir, "output"),
    filePath: "src/tests/feature/test",
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
    validationDir: "data/test/validation",
    outputDir: "data/test/output",
    filePath: "src/tests/feature/test",
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

test("when serializer does not support value, throws error", () => {
  expect(() =>
    new ValidationFileMatcher({
      validationDir: "data/test/validation",
      outputDir: "data/test/output",
      filePath: "src/tests/feature.test.ts",
      serializer: new FailingSerializer(),
    }).matchFileSnapshot(["value"]),
  ).toThrowError();
});
