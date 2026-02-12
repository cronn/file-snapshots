import path from "node:path";
import { type TestContext, expect, test } from "vitest";

import { ValidationFileMatcher } from "../matcher/validation-file-matcher";
import { JsonSerializer } from "../serializers/json-serializer";
import { TextSerializer } from "../serializers/text-serializer";
import type {
  UpdateSnapshotsType,
  ValidationFileMatcherConfig,
  ValidationFileMatcherResult,
} from "../types/matcher";
import { normalizeFileName, readSnapshotFile } from "../utils/file";
import {
  FailingSerializer,
  SNAPSHOTS_DIR,
  createTmpDir,
  normalizePath,
  resolveTestContext,
} from "../utils/test";

async function snapshotMatcherResult(
  context: TestContext,
  matcherResult: ValidationFileMatcherResult,
  tmpDir?: string,
): Promise<void> {
  const { actual, expected, outputFilePath, validationFilePath, message } =
    matcherResult;
  const { testFileName, testName } = resolveTestContext(context);
  const normalizedTestName = normalizeFileName(testName);
  const normalizedMessage = normalizePath(message(), tmpDir);
  const normalizedOutputFilePath = normalizePath(outputFilePath, tmpDir);
  const normalizedValidationFilePath = normalizePath(
    validationFilePath,
    tmpDir,
  );

  const aggregatedSnapshot = `
# message
> ${normalizedMessage}

# actual
${codeBlock(actual)}

# expected
${codeBlock(expected)}

# output file
${normalizedOutputFilePath}
${optionalFileBlock(outputFilePath)}

# validation file
${normalizedValidationFilePath}
${optionalFileBlock(validationFilePath)}
`;

  const snapshotFilePath = path.join(
    ".",
    SNAPSHOTS_DIR,
    testFileName,
    `${normalizedTestName}.md`,
  );
  await expect(aggregatedSnapshot).toMatchFileSnapshot(snapshotFilePath);
}

function codeBlock(value: string): string {
  return ["```", value, "```"].join("\n");
}

function optionalFileBlock(filePath: string): string {
  try {
    const fileContents = readSnapshotFile(filePath);
    return codeBlock(fileContents);
  } catch {
    return "> File does not exist.";
  }
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
  matcherResult.writeFileSnapshots();

  await snapshotMatcherResult(context, matcherResult, tmpDir);
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
  matcherResult.writeFileSnapshots();

  await snapshotMatcherResult(context, matcherResult);
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
    matcherResult.writeFileSnapshots();

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
  matcherResult.writeFileSnapshots();

  expect(matcher.isValidationFileMissing).toBe(true);
  await snapshotMatcherResult(context, matcherResult, tmpDir);
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
  changedMatcherResult.writeFileSnapshots();

  await snapshotMatcherResult(context, changedMatcherResult, tmpDir);
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
    changedMatcherResult.writeFileSnapshots();

    await snapshotMatcherResult(context, changedMatcherResult);
  },
);
