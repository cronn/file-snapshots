import { rmSync } from "node:fs";
import path from "node:path";

const TMP_DIR = ".tmp";

export const TMP_VALIDATION_DIR = path.join(TMP_DIR, "validation");
export const TMP_OUTPUT_DIR = path.join(TMP_DIR, "output");

export function cleanTmpDir(): void {
  rmSync(TMP_DIR, { recursive: true, force: true });
}
