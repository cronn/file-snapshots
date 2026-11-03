import { readdir, rmdir, stat } from "node:fs/promises";
import path from "node:path";

export const DEFAULT_DIR = "data/test";
export const VALIDATION_DIR_NAME = "validation";
export const OUTPUT_DIR_NAME = "output";

export async function isDirectory(dirPath: string): Promise<boolean> {
  try {
    return (await stat(dirPath)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Lists all files within `rootDir` recursively.
 * Returns paths relative to `rootDir` using `/` as separator.
 * Returns an empty list if `rootDir` does not exist.
 */
export async function listFiles(rootDir: string): Promise<Array<string>> {
  if (!(await isDirectory(rootDir))) {
    return [];
  }

  const entries = await readdir(rootDir, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      toPosixPath(
        path.relative(rootDir, path.join(entry.parentPath, entry.name)),
      ),
    )
    .sort();
}

/**
 * Removes empty directories starting at `dirPath` up to (excluding) `rootDir`.
 */
export async function removeEmptyParentDirs(
  dirPath: string,
  rootDir: string,
): Promise<void> {
  const resolvedRootDir = path.resolve(rootDir);
  let currentDir = path.resolve(dirPath);

  while (
    currentDir !== resolvedRootDir &&
    currentDir.startsWith(resolvedRootDir + path.sep)
  ) {
    const entries = await readdir(currentDir);
    if (entries.length > 0) {
      return;
    }

    await rmdir(currentDir);
    currentDir = path.dirname(currentDir);
  }
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}
