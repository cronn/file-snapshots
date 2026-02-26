import { expect, test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";
import {
  SnapshotInstrumentation,
  assertSnapshotIntervals,
  runOnlyWhenSnapshotUpdatesAreEnabled,
  tags,
  temporarySnapshotDirs,
  testFilePathResolver,
} from "../src/utils/test";

test("stores snapshots in custom directories", async () => {
  const testExpect = defineValidationFileExpect({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  await testExpect("value").toMatchTextFile();
});

test("applies custom file path resolver", async () => {
  const testExpect = defineValidationFileExpect({
    resolveFilePath: testFilePathResolver,
  });

  await testExpect("value").toMatchTextFile({ name: "name" });
});

test("when snapshot does not match, hard assertion throws error", async () => {
  const testExpect = defineValidationFileExpect();

  await expect(() =>
    testExpect("changed value").toMatchJsonFile(),
  ).rejects.toThrowError();
});

test.fail(
  "when snapshot does not match, soft assertion fails test",
  async () => {
    const testExpect = defineValidationFileExpect();

    await testExpect.soft("changed value").toMatchJsonFile();
  },
);

test("applies indentSize to JSON file snapshots", async () => {
  const testExpect = defineValidationFileExpect({
    indentSize: 4,
  });

  await testExpect({ key: "value" }).toMatchJsonFile();
});

test("ignores indentSize in text file snapshots", async () => {
  const testExpect = defineValidationFileExpect({
    indentSize: 4,
  });

  await testExpect("value").toMatchTextFile();
});

test("applies update delay", { tag: tags.updateAll }, async () => {
  runOnlyWhenSnapshotUpdatesAreEnabled();

  const testExpect = defineValidationFileExpect({
    ...temporarySnapshotDirs(),
    updateDelay: 100,
  });

  const instrumentation = new SnapshotInstrumentation();
  await expect(() =>
    testExpect("initial value").toMatchJsonFile(),
  ).rejects.toThrowError();
  await expect(() =>
    testExpect(() => {
      instrumentation.addSnapshot();
      return "changed value";
    }).toMatchJsonFile(),
  ).rejects.toThrowError();

  assertSnapshotIntervals([100], instrumentation);
});
