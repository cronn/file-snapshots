import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { packageDirectory } from "package-directory";

import type { FilePathResolverParams } from "@cronn/lib-file-snapshots";

import type { VitestValidationFileMatcherConfig } from "../matchers/types";

export const tags = {
  updateAll: "update-all",
  updateNew: "update-new",
  updateNone: "update-none",
};

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

export async function resolvePackageRootDir(fromDir: string): Promise<string> {
  const packageDir = await packageDirectory({
    cwd: fromDir,
  });

  if (packageDir === undefined) {
    throw new Error("Unable to resolve root directory of package");
  }

  return packageDir;
}

export function testFilePathResolver(params: FilePathResolverParams): string {
  const { testPath, titlePath, name } = params;
  const normalizedTitlePath = path.join(
    ...titlePath.map((title) => title.replaceAll(" ", "-")),
  );
  return path.join(testPath, normalizedTitlePath, name ?? "");
}
