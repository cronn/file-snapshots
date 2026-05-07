import { expect, test } from "@playwright/test";

import { defineFileSnapshotMatchers } from "../src";
import {
  SnapshotInstrumentation,
  assertSnapshotIntervals,
  runOnlyWhenSnapshotUpdatesAreEnabled,
  tags,
  temporarySnapshotDirs,
} from "../src/utils/test";

test("when validation file is missing, waits for delay before creating snapshot", async () => {
  const testExpect = defineFileSnapshotMatchers(temporarySnapshotDirs());

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
  { tag: tags.updateAll },
  async () => {
    runOnlyWhenSnapshotUpdatesAreEnabled();

    const testExpect = defineFileSnapshotMatchers(temporarySnapshotDirs());

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

    assertSnapshotIntervals([250], instrumentation);
  },
);

test("when validation file exists, repeats failing snapshot until it matches", async () => {
  const testExpect = defineFileSnapshotMatchers();

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
  const testExpect = defineFileSnapshotMatchers().configure({ timeout: 2_000 });

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
  const testExpect = defineFileSnapshotMatchers();

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
  const testExpect = defineFileSnapshotMatchers();

  await expect(() =>
    testExpect((value: unknown) => value).toMatchJsonFile(),
  ).rejects.toThrowError();
});
