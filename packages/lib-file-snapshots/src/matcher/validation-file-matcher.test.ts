import fs from "node:fs";
import path from "node:path";
import { type TestContext, expect, test } from "vitest";

import { JsonSerializer } from "../serializers/json-serializer";
import { TextSerializer } from "../serializers/text-serializer";
import type {
  UpdateSnapshotsType,
  ValidationFileMatcherConfig,
  ValidationFileMatcherResult,
} from "../types/matcher";
import {
  addTrailingNewLine,
  normalizeFileName,
  readSnapshotFile,
} from "../utils/file";
import {
  FailingSerializer,
  SNAPSHOTS_DIR,
  createTmpDir,
  normalizePath,
  resolveTestContext,
} from "../utils/test";

import { ValidationFileMatcher } from "./validation-file-matcher";

async function snapshotMatcherResult(
  context: TestContext,
  matcherResult: ValidationFileMatcherResult,
  tmpDir?: string,
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
  await expect(normalizePath(outputFilePath, tmpDir)).toMatchFileSnapshot(
    path.join(snapshotDir, "output_file_path.txt"),
  );
  await expect(normalizePath(validationFilePath, tmpDir)).toMatchFileSnapshot(
    path.join(snapshotDir, "validation_file_path.txt"),
  );
  await expect(normalizePath(message(), tmpDir)).toMatchFileSnapshot(
    path.join(snapshotDir, "message.txt"),
  );
}

function persistentSnapshotDirs(): Pick<
  ValidationFileMatcherConfig,
  "validationDir" | "outputDir"
> {
  return {
    validationDir: "data/test/validation",
    outputDir: "data/test/output",
  };
}

function temporarySnapshotDirs(
  tmpDir: string,
): Pick<ValidationFileMatcherConfig, "validationDir" | "outputDir"> {
  return {
    validationDir: path.join(tmpDir, "validation"),
    outputDir: path.join(tmpDir, "output"),
  };
}

test("when validation file is missing, creates validation file with marker", async (context) => {
  const tmpDir = createTmpDir();

  const matcher = new ValidationFileMatcher({
    ...temporarySnapshotDirs(tmpDir),
    filePath: "src/tests/feature/test",
    serializer: new TextSerializer(),
  });
  expect(matcher.isValidationFileMissing).toBe(true);
  expect(matcher.isUpdate).toBe(true);

  const matcherResult = matcher.matchFileSnapshot("value");
  await snapshotMatcherResult(context, matcherResult, tmpDir);

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
    ...persistentSnapshotDirs(),
    filePath: "src/tests/feature/test",
    serializer: new JsonSerializer(),
  });
  expect(matcher.isValidationFileMissing).toBe(false);
  expect(matcher.isUpdate).toBe(false);

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
      ...persistentSnapshotDirs(),
      filePath: "src/tests/feature.test.ts",
      serializer: new FailingSerializer(),
    }).matchFileSnapshot(["value"]),
  ).toThrowError();
});

test.for(["all", "missing"] as const)(
  "when update type is '%s', creates validation file with marker",
  async (updateType: UpdateSnapshotsType, context: TestContext) => {
    const tmpDir = createTmpDir();

    const matcher = new ValidationFileMatcher({
      ...temporarySnapshotDirs(tmpDir),
      filePath: "src/tests/feature/test",
      serializer: new TextSerializer(),
      updateSnapshots: updateType,
    });
    expect(matcher.isValidationFileMissing).toBe(true);
    expect(matcher.isUpdate).toBe(true);

    const matcherResult = matcher.matchFileSnapshot("value");
    await snapshotMatcherResult(context, matcherResult, tmpDir);
  },
);

test("when update type is 'none', does not create validation file", async (context) => {
  const tmpDir = createTmpDir();

  const matcher = new ValidationFileMatcher({
    ...temporarySnapshotDirs(tmpDir),
    filePath: "src/tests/feature/test",
    serializer: new TextSerializer(),
    updateSnapshots: "none",
  });
  expect(matcher.isValidationFileMissing).toBe(true);
  expect(matcher.isUpdate).toBe(false);

  const matcherResult = matcher.matchFileSnapshot("value");
  await snapshotMatcherResult(context, matcherResult, tmpDir);
  matcherResult.writeFileSnapshots();

  expect(matcher.isValidationFileMissing).toBe(true);
  expect(fs.existsSync(matcherResult.validationFilePath)).toBe(false);
});

test("when update type is 'all', updates validation file", async (context) => {
  const tmpDir = createTmpDir();

  const matcher = new ValidationFileMatcher({
    ...temporarySnapshotDirs(tmpDir),
    filePath: "src/tests/feature/test",
    serializer: new TextSerializer(),
    updateSnapshots: "all",
  });

  const initialMatcherResult = matcher.matchFileSnapshot("initial value");
  initialMatcherResult.writeFileSnapshots();

  expect(matcher.isValidationFileMissing).toBe(false);
  expect(matcher.isUpdate).toBe(true);

  const changedMatcherResult = matcher.matchFileSnapshot("changed value");
  await snapshotMatcherResult(context, changedMatcherResult, tmpDir);
  changedMatcherResult.writeFileSnapshots();

  expect(readSnapshotFile(changedMatcherResult.validationFilePath)).toBe(
    addTrailingNewLine("changed value"),
  );
});

test.for(["missing", "none"] as const)(
  "when update type is '%s', does not update validation file",
  async (updateType: UpdateSnapshotsType, context) => {
    const matcher = new ValidationFileMatcher({
      ...persistentSnapshotDirs(),
      filePath: `src/tests/update-type-${updateType}`,
      serializer: new TextSerializer(),
      updateSnapshots: updateType,
    });
    expect(matcher.isValidationFileMissing).toBe(false);
    expect(matcher.isUpdate).toBe(false);

    const changedMatcherResult = matcher.matchFileSnapshot("changed value");
    await snapshotMatcherResult(context, changedMatcherResult);
    changedMatcherResult.writeFileSnapshots();

    expect(readSnapshotFile(changedMatcherResult.validationFilePath)).toBe(
      addTrailingNewLine("initial value"),
    );
  },
);
