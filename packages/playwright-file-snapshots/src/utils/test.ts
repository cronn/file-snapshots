import { expect, test } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type { FilePathResolverParams } from "@cronn/lib-file-snapshots";

import { parseUpdateSnapshots } from "../matchers/utils";

export function createTmpDir(): string {
  return mkdtempSync(path.join(tmpdir(), "test-"));
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

export const SNAPSHOT_UPDATE_TAG = "@snapshot-update";

export function runOnlyWhenSnapshotUpdatesAreEnabled(): void {
  const updateSnapshots = parseUpdateSnapshots(
    test.info().config.updateSnapshots,
  );
  test.skip(!updateSnapshots, "Snapshot updates are disabled");
}
