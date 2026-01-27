import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { packageDirectory } from "package-directory";

import type { VitestValidationFileMatcherConfig } from "../matchers/types";

export function temporarySnapshotDirs(): Required<
  Pick<VitestValidationFileMatcherConfig, "validationDir" | "outputDir">
> {
  const tmpDir = createTmpDir();
  return {
    validationDir: path.join(tmpDir, "validation"),
    outputDir: path.join(tmpDir, "output"),
  };
}

function createTmpDir(): string {
  return mkdtempSync(path.join(tmpdir(), "test-"));
}

export function isUpdateSnapshot(updateType: "new" | "all" | "none"): boolean {
  const updateTypeEnv = process.env.UPDATE_TYPE;

  if (process.env.CI === "true") {
    return updateType === "none";
  }

  return updateTypeEnv === updateType;
}

export async function resolvePackageRootDir(fromDir: string): Promise<string> {
  const packageDir = await packageDirectory({
    cwd: fromDir,
  });

  if (packageDir === undefined) {
    throw new Error("Unable to resolve root directory of package");
  }

  return packageDir;
}
