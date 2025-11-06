import type { TestInfo, TestStepInfo } from "@playwright/test";

import { resolvePackageRootDir } from "../utils/file";

type RawTestInfo = Pick<TestInfo, "config">;

export interface ParsedTestInfo {
  rootDir: string;
  updateSnapshots: boolean;
}

export async function parseTestInfo(
  testInfo: RawTestInfo,
): Promise<ParsedTestInfo> {
  const { config } = testInfo;

  return {
    rootDir: await resolvePackageRootDir(config.rootDir),
    updateSnapshots: parseUpdateSnapshots(config.updateSnapshots),
  };
}

export function parseUpdateSnapshots(
  updateSnapshots: TestInfo["config"]["updateSnapshots"],
): boolean {
  return updateSnapshots === "changed" || updateSnapshots === "all";
}

type RawTestStepInfo = Pick<TestStepInfo, "titlePath">;

interface ParsedTestStepInfo {
  testPath: string;
  titlePath: Array<string>;
}

export function parseTestStepInfo(
  testStepInfo: RawTestStepInfo,
): ParsedTestStepInfo {
  const [testPath, ...titlePath] = testStepInfo.titlePath;

  if (testPath === undefined) {
    throw new Error("titlePath is empty");
  }

  return {
    testPath: parseTestPath(testPath),
    titlePath: parseTitlePath(titlePath),
  };
}

export function parseTestPath(testPath: string): string {
  return testPath.replace(/\.(test|spec)\.(js|ts|mjs)$/, "");
}

export const MATCHER_STEP_TITLE = "Match validation file";

const EXPECT_STEP_REGEXP = /^Expect "[\w ]+"$/;

export function parseTitlePath(titlePath: Array<string>): Array<string> {
  return titlePath.filter(isUserDefinedTitle);
}

function isUserDefinedTitle(title: string): boolean {
  return title !== MATCHER_STEP_TITLE && !EXPECT_STEP_REGEXP.test(title);
}
