import path from "node:path";
import { packageDirectory } from "package-directory";

export async function resolvePackageRootDir(fromDir: string): Promise<string> {
  const packageDir = await packageDirectory({
    cwd: fromDir,
  });

  if (packageDir === undefined) {
    throw new Error("Unable to resolve root directory of package");
  }

  return packageDir;
}

export function ensureAbsolutePath(baseDir: string, rootDir: string): string {
  if (path.isAbsolute(baseDir)) {
    return baseDir;
  }

  return path.join(rootDir, baseDir);
}
