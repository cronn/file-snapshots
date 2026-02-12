import path from "node:path";
import { describe, expect, test } from "vitest";

import { ensureAbsolutePath, resolvePackageRootDir } from "../utils/file";
import { createTmpDir } from "../utils/test";

describe("resolvePackageRootDir", () => {
  test("returns root directory of package", async () => {
    const packageRootDir = await resolvePackageRootDir(import.meta.dirname);
    expect(path.basename(packageRootDir)).toBe("playwright-file-snapshots");
  });

  test("when no package root exists, throws error", async () => {
    const tmpDir = createTmpDir();
    await expect(() => resolvePackageRootDir(tmpDir)).rejects.toThrowError();
  });
});

describe("ensureAbsolutePath", () => {
  const absoluteDir = import.meta.dirname;

  test("when path is absolute, returns original path", () => {
    expect(ensureAbsolutePath(absoluteDir, "/")).toBe(absoluteDir);
  });

  test("when path is relative, prepends rootDir to original path", () => {
    const relativeDir = "relative/path/to/dir";
    expect(ensureAbsolutePath(relativeDir, absoluteDir)).toBe(
      path.join(absoluteDir, relativeDir),
    );
  });
});
