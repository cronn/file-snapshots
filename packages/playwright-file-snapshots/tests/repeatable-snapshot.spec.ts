import { expect, test } from "@playwright/test";
import path from "node:path";

import { defineValidationFileExpect } from "../src";
import {
  SNAPSHOT_UPDATE_TAG,
  SnapshotInstrumentation,
  assertSnapshotIntervals,
  createTmpDir,
  runOnlyWhenSnapshotUpdatesAreEnabled,
} from "../src/utils/test";

test("when validation file is missing, waits for delay before creating snapshot", async () => {
  const tmpDir = createTmpDir();

  const testExpect = defineValidationFileExpect({
    validationDir: path.join(tmpDir, "validation"),
    outputDir: path.join(tmpDir, "output"),
  });

  const instrumentation = new SnapshotInstrumentation();
  await expect(() =>
    testExpect(() => {
      instrumentation.addSnapshot();
      return "missing value";
    }).toMatchJsonFile(),
  ).rejects.toThrowError();

  assertSnapshotIntervals([250], instrumentation);
});

test(
  "when snapshot updates are enabled, waits for delay before creating snapshot",
  { tag: [SNAPSHOT_UPDATE_TAG] },
  async () => {
    runOnlyWhenSnapshotUpdatesAreEnabled();

    const testExpect = defineValidationFileExpect();

    const instrumentation = new SnapshotInstrumentation();
    await expect(() =>
      testExpect(() => {
        instrumentation.addSnapshot();
        return "changed value";
      }).toMatchJsonFile(),
    ).rejects.toThrowError();

    assertSnapshotIntervals([250], instrumentation);
  },
);

test("when validation file exists, repeats failing snapshot until it matches", async () => {
  const testExpect = defineValidationFileExpect();

  const instrumentation = new SnapshotInstrumentation();
  await testExpect(() => {
    if (instrumentation.snapshotCount === 3) {
      return "stable value";
    } else {
      instrumentation.addSnapshot();
      return `unstable value ${instrumentation.snapshotCount}`;
    }
  }).toMatchJsonFile();

  assertSnapshotIntervals([0, 100, 250], instrumentation);
});

test("when validation file exists, repeats failing snapshot until timeout", async () => {
  const testExpect = defineValidationFileExpect().configure({ timeout: 2_000 });

  const instrumentation = new SnapshotInstrumentation();
  await testExpect(() =>
    testExpect(() => {
      instrumentation.addSnapshot();
      return `unstable value ${instrumentation.snapshotCount}`;
    }).toMatchJsonFile(),
  ).rejects.toThrowError();

  assertSnapshotIntervals([0, 100, 250, 500, 1000, 1000], instrumentation);
});

test("applies custom timeout", async () => {
  const testExpect = defineValidationFileExpect();

  const instrumentation = new SnapshotInstrumentation();
  await testExpect(async () =>
    testExpect(() => {
      instrumentation.addSnapshot();
      return `unstable value ${instrumentation.snapshotCount}`;
    }).toMatchJsonFile({ timeout: 0 }),
  ).rejects.toThrowError();

  assertSnapshotIntervals([0], instrumentation);
});

test("when trying to snapshot a function with parameters, throws error", async () => {
  const testExpect = defineValidationFileExpect();

  await expect(() =>
    testExpect((value: unknown) => value).toMatchJsonFile(),
  ).rejects.toThrowError();
});
