import path from "node:path";
import { expect } from "vitest";

import type { UpdateSnapshotsType } from "@cronn/lib-file-snapshots";

import { TEST_PATH_SEPARATOR } from "./config";

const TESTS_DIR_REGEXP = /(^|\/|\\)__tests__(?=\/|\\)/;
const TEST_EXTENSION_REGEXP = /\.(test|spec)\.[cm]?[tj]sx?$/;

export function parseTestName(currentTestName: string): Array<string> {
  return currentTestName.split(TEST_PATH_SEPARATOR);
}

export function parseTestPath(testPath: string, testDir: string): string {
  const relativeTestPath = path.relative(testDir, testPath);

  return relativeTestPath
    .replace(TESTS_DIR_REGEXP, "")
    .replace(TEST_EXTENSION_REGEXP, "");
}

export function readUpdateSnapshot(): unknown {
  const snapshotState = expect.getState().snapshotState as object;

  if ("_updateSnapshot" in snapshotState) {
    return snapshotState._updateSnapshot;
  }

  return undefined;
}

export function parseUpdateSnapshot(
  updateSnapshot: unknown,
): UpdateSnapshotsType {
  switch (updateSnapshot) {
    case "all":
      return "all";
    case "none":
      return "none";
    default:
      return "missing";
  }
}
