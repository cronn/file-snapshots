import path from "node:path";

import {
  DEFAULT_DIR,
  OUTPUT_DIR_NAME,
  VALIDATION_DIR_NAME,
  isDirectory,
  listFiles,
} from "./utils/file";

export interface FindUnusedSnapshotsOptions {
  /**
   * Directories containing the `validation` and `output` directories.
   * Relative paths are resolved against the current working directory.
   *
   * @default ["data/test"]
   */
  dirs?: Array<string>;

  /**
   * Glob patterns for validation files which should never be reported as unused,
   * e.g. because they are only written in some test runs.
   * Patterns are matched against the file path relative to the `validation` directory.
   * Every pattern must match at least one validation file.
   */
  ignore?: Array<string>;
}

export interface UnusedSnapshot {
  /**
   * Directory containing the `validation` and `output` directories, as passed in `dirs`
   */
  dir: string;

  /**
   * Path of the validation file relative to the `validation` directory
   */
  file: string;

  /**
   * Path of the validation file, starting at `dir`
   */
  path: string;
}

/**
 * Finds validation files for which no output file has been written in the last test run.
 *
 * Output files are written on every test run, so a validation file without a corresponding
 * output file belongs to a test that no longer exists, e.g. because it was renamed or deleted.
 * The result is only meaningful after running the complete test suite.
 */
export async function findUnusedSnapshots(
  options: FindUnusedSnapshotsOptions = {},
): Promise<Array<UnusedSnapshot>> {
  const { dirs = [DEFAULT_DIR], ignore = [] } = options;

  const ignoreMatchers = ignore.map((pattern) => ({
    pattern,
    isMatch: (file: string) => path.posix.matchesGlob(file, pattern),
    isUsed: false,
  }));

  const unusedSnapshots: Array<UnusedSnapshot> = [];

  for (const dir of dirs) {
    const validationDir = path.posix.join(dir, VALIDATION_DIR_NAME);
    if (!(await isDirectory(validationDir))) {
      throw new Error(`Validation directory "${validationDir}" does not exist`);
    }

    const validationFiles = await listFiles(validationDir);
    const outputFiles = new Set(
      await listFiles(path.join(dir, OUTPUT_DIR_NAME)),
    );

    for (const file of validationFiles) {
      const matchingIgnores = ignoreMatchers.filter((matcher) =>
        matcher.isMatch(file),
      );
      for (const matcher of matchingIgnores) {
        matcher.isUsed = true;
      }

      if (matchingIgnores.length > 0 || outputFiles.has(file)) {
        continue;
      }

      unusedSnapshots.push({
        dir,
        file,
        path: path.posix.join(validationDir, file),
      });
    }
  }

  const unmatchedPatterns = ignoreMatchers
    .filter((matcher) => !matcher.isUsed)
    .map((matcher) => `"${matcher.pattern}"`);
  if (unmatchedPatterns.length > 0) {
    throw new Error(
      `No validation file matches the ignore pattern(s) ${unmatchedPatterns.join(", ")}`,
    );
  }

  return unusedSnapshots;
}
