import type { PlaywrightTestConfig } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type { FilePathResolverParams } from "@cronn/lib-file-snapshots";

import type { PlaywrightValidationFileMatcherConfig } from "../matchers/types";

export function createTmpDir(): string {
  return mkdtempSync(path.join(tmpdir(), "test-"));
}

export function temporarySnapshotDirs(): Required<
  Pick<PlaywrightValidationFileMatcherConfig, "validationDir" | "outputDir">
> {
  const tmpDir = createTmpDir();
  return {
    validationDir: path.join(tmpDir, "validation"),
    outputDir: path.join(tmpDir, "output"),
  };
}

export function testFilePathResolver(params: FilePathResolverParams): string {
  const { testPath, titlePath, name } = params;
  const normalizedTitlePath = path.join(
    ...titlePath.map((title) => title.replaceAll(" ", "-")),
  );
  return path.join(testPath, normalizedTitlePath, name ?? "");
}

export class SnapshotInstrumentation {
  public readonly snapshotIntervals: Array<number> = [];

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

const maximumIntervalDifference = 125;

export function assertSnapshotIntervals(
  expectedIntervals: Array<number>,
  instrumentation: SnapshotInstrumentation,
): void {
  expect(instrumentation.snapshotCount).toBe(expectedIntervals.length);

  for (const [intervalIndex, expectedInterval] of expectedIntervals.entries()) {
    const actualInterval = instrumentation.snapshotIntervals.at(intervalIndex)!;
    expect(actualInterval).toBeGreaterThanOrEqual(expectedInterval);
    expect(actualInterval).toBeLessThan(
      expectedInterval + maximumIntervalDifference,
    );
  }
}

export const tags = {
  updateAll: "@update-all",
  updateChanged: "@update-changed",
  updateNone: "@update-none",
};

export type PlaywrightUpdateType = PlaywrightTestConfig["updateSnapshots"];

export function runOnlyWhenSnapshotUpdatesAreEnabled(): void {
  runOnlyWhenUpdateSnapshotsIs("all", "changed");
}

export function runOnlyWhenUpdateSnapshotsIs(
  ...expectedUpdateTypes: Array<PlaywrightUpdateType>
): void {
  const updateType = test.info().config.updateSnapshots;
  const isExpectedUpdateType = !expectedUpdateTypes.includes(updateType);
  test.skip(isExpectedUpdateType, `Skip when updateSnapshots is ${updateType}`);
}
