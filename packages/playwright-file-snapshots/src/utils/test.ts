import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type { FilePathResolverParams } from "@cronn/lib-file-snapshots";

export function createTmpDir(): string {
  return mkdtempSync(path.join(tmpdir(), "test-"));
}

export function testFilePathResolver(params: FilePathResolverParams): string {
  const { testPath, titlePath, name } = params;
  const normalizedTitlePath = path.join(
    ...titlePath.map((title) => title.replaceAll(" ", "-")),
  );
  return path.join(testPath, normalizedTitlePath, name ?? "");
}
