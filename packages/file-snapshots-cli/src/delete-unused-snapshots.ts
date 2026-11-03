import { rm } from "node:fs/promises";
import path from "node:path";

import {
  type FindUnusedSnapshotsOptions,
  type UnusedSnapshot,
  findUnusedSnapshots,
} from "./find-unused-snapshots";
import { VALIDATION_DIR_NAME, removeEmptyParentDirs } from "./utils/file";

/**
 * Deletes validation files for which no output file has been written in the last test run.
 * Directories which become empty are removed as well.
 *
 * Returns the deleted validation files.
 *
 * @see findUnusedSnapshots
 */
export async function deleteUnusedSnapshots(
  options: FindUnusedSnapshotsOptions = {},
): Promise<Array<UnusedSnapshot>> {
  const unusedSnapshots = await findUnusedSnapshots(options);

  for (const snapshot of unusedSnapshots) {
    await rm(snapshot.path);
    await removeEmptyParentDirs(
      path.dirname(snapshot.path),
      path.join(snapshot.dir, VALIDATION_DIR_NAME),
    );
  }

  return unusedSnapshots;
}
