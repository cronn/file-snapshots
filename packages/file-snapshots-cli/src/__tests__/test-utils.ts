import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach } from "vitest";

import { listFiles } from "../utils/file";

/**
 * Creates a temporary directory per test and changes the working directory to it.
 * Returns a getter for the current temporary directory.
 */
export function useTmpDir(): () => string {
  const originalCwd = process.cwd();
  let tmpDir = "";

  beforeEach(async () => {
    tmpDir = await mkdtemp(path.join(tmpdir(), "file-snapshots-cli-"));
    process.chdir(tmpDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(tmpDir, { recursive: true, force: true });
  });

  return () => tmpDir;
}

export async function createFiles(files: Array<string>): Promise<void> {
  for (const file of files) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, "");
  }
}

export async function listAllFiles(): Promise<Array<string>> {
  return listFiles(".");
}
