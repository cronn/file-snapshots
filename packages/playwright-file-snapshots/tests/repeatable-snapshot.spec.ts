import { expect, test } from "@playwright/test";
import path from "node:path";

import { defineValidationFileExpect } from "../src";
import { createTmpDir } from "../src/utils/test";

class SnapshotInstrumentation {
  public readonly snapshotIntervals: number[] = [];

  private intervalStartTime = performance.now();

  public get snapshotCount(): number {
    return this.snapshotIntervals.length;
  }

  public addSnapshot(): void {
    const currentTime = performance.now();
    this.snapshotIntervals.push(currentTime - this.intervalStartTime);
    this.intervalStartTime = currentTime;
  }
}

function assertSnapshotIntervals(
  expectedIntervals: number[],
  instrumentation: SnapshotInstrumentation,
): void {
  expect(instrumentation.snapshotCount).toBe(expectedIntervals.length);

  for (const [intervalIndex, expectedInterval] of expectedIntervals.entries()) {
    const actualInterval = instrumentation.snapshotIntervals.at(intervalIndex)!;
    expect(actualInterval).toBeGreaterThanOrEqual(expectedInterval);
    expect(actualInterval).toBeLessThan(expectedInterval + 50);
  }
}

test("when validation file is missing, waits for delay before creating snapshot", async () => {
  const tmpDir = createTmpDir();

  const testExpect = defineValidationFileExpect({
    validationDir: path.join(tmpDir, "validation"),
    outputDir: path.join(tmpDir, "output"),
    soft: false,
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
  { tag: ["@snapshot-update"] },
  async () => {
    test.skip(
      test.info().config.updateSnapshots !== "changed",
      "Snapshot updates are disabled",
    );

    const testExpect = defineValidationFileExpect({
      soft: false,
    });

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
  const testExpect = defineValidationFileExpect({
    soft: false,
  }).configure({ timeout: 2_000 });

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
  const testExpect = defineValidationFileExpect({
    soft: false,
  });

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
  const testExpect = defineValidationFileExpect({
    soft: false,
  });

  await expect(() =>
    testExpect((value: unknown) => value).toMatchJsonFile(),
  ).rejects.toThrowError();
});
