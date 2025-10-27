import path from "node:path";

import { TEST_PATH_SEPARATOR } from "./config";

const TESTS_DIR_REGEXP = /(^|\/|\\)__tests__(?=\/|\\)/;
const TEST_EXTENSION_REGEXP = /\.(test|spec)\.[cm]?[tj]sx?$/;

export function parseTestName(currentTestName: string): Array<string> {
  return currentTestName.split(TEST_PATH_SEPARATOR);
}

export function parseTestPath(testPath: string, testDir: string): string {
  const relativeTestPath = path.relative(testDir, testPath);

  return relativeTestPath
    .replace(TESTS_DIR_REGEXP, "")
    .replace(TEST_EXTENSION_REGEXP, "");
}
