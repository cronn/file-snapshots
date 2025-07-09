import path from "node:path";

import { TEST_PATH_SEPARATOR } from "./config";

export function parseTestName(currentTestName: string): Array<string> {
  return currentTestName.split(TEST_PATH_SEPARATOR);
}

export function parseTestPath(testPath: string, testDir: string): string {
  const relativeTestPath = path.relative(testDir, testPath);

  return relativeTestPath.replace(/\.(test|spec)\.[cm]?[tj]sx?$/, "");
}
