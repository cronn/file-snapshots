import { expect, test } from "@playwright/test";

import { defineFileSnapshotMatchers } from "../src";
import {
  SnapshotInstrumentation,
  assertSnapshotIntervals,
  runOnlyWhenSnapshotUpdatesAreEnabled,
  tags,
  temporarySnapshotDirs,
  testFilePathResolver,
} from "../src/utils/test";

test("stores snapshots in custom directories", async () => {
  const testExpect = defineFileSnapshotMatchers({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  await testExpect("value").toMatchTextFile();
});

test("applies custom file path resolver", async () => {
  const testExpect = defineFileSnapshotMatchers({
    resolveFilePath: testFilePathResolver,
  });

  await testExpect("value").toMatchTextFile({ name: "name" });
});

test("when snapshot does not match, hard assertion throws error", async () => {
  const testExpect = defineFileSnapshotMatchers();

  await expect(() =>
    testExpect("changed value").toMatchJsonFile(),
  ).rejects.toThrowError();
});

test.fail(
  "when snapshot does not match, soft assertion fails test",
  async () => {
    const testExpect = defineFileSnapshotMatchers();

    await testExpect.soft("changed value").toMatchJsonFile();
  },
);

test("applies indentSize to JSON file snapshots", async () => {
  const testExpect = defineFileSnapshotMatchers({
    indentSize: 4,
  });

  await testExpect({ key: "value" }).toMatchJsonFile();
});

test("ignores indentSize in text file snapshots", async () => {
  const testExpect = defineFileSnapshotMatchers({
    indentSize: 4,
  });

  await testExpect("value").toMatchTextFile();
});

test("applies update delay", { tag: tags.updateAll }, async () => {
  runOnlyWhenSnapshotUpdatesAreEnabled();

  const testExpect = defineFileSnapshotMatchers({
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
