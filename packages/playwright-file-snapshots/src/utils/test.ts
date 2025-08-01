import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export function createTmpDir(): string {
  return mkdtempSync(path.join(tmpdir(), "test-"));
}
