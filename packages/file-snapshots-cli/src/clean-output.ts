import { rm } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_DIR, OUTPUT_DIR_NAME, isDirectory } from "./utils/file";

export interface CleanOutputOptions {
  /**
   * Directories containing the `output` directory.
   * Relative paths are resolved against the current working directory.
   *
   * @default ["data/test"]
   */
  dirs?: Array<string>;
}

/**
 * Deletes the `output` directories containing the file snapshots of the last test run.
 *
 * Returns the deleted output directories.
 */
export async function cleanOutput(
  options: CleanOutputOptions = {},
): Promise<Array<string>> {
  const { dirs = [DEFAULT_DIR] } = options;

  const deletedDirs: Array<string> = [];
  for (const dir of dirs) {
    const outputDir = path.posix.join(dir, OUTPUT_DIR_NAME);
    if (!(await isDirectory(outputDir))) {
      continue;
    }

    await rm(outputDir, { recursive: true, force: true });
    deletedDirs.push(outputDir);
  }

  return deletedDirs;
}
