import path from "node:path";
import type { SnapshotUpdateState } from "vitest";
import { type MatcherState } from "vitest";

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

interface ParsedMatcherState {
  updateSnapshots: UpdateSnapshotsType;
}

type SnapshotState = Pick<MatcherState["snapshotState"], "snapshotUpdateState">;

export function parseSnapshotState(
  snapshotState: SnapshotState,
): ParsedMatcherState {
  return {
    updateSnapshots: parseSnapshotUpdateState(
      snapshotState.snapshotUpdateState,
    ),
  };
}

export function parseSnapshotUpdateState(
  snapshotUpdateState: SnapshotUpdateState,
): UpdateSnapshotsType {
  switch (snapshotUpdateState) {
    case "all":
      return "all";
    case "none":
      return "none";
    default:
      return "missing";
  }
}
