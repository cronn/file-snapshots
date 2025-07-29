import type { TestInfo } from "@playwright/test";

import type {
  TestInfoInternal,
  TestStepInternal,
} from "../types/playwright-internals";

import type { StepFilter } from "./types";

export type RawTestInfo = Pick<TestInfo, "titlePath">;

interface ParsedTestInfo {
  testPath: string;
  titlePath: Array<string>;
}

export function parseTestInfo(
  testInfo: RawTestInfo,
  filterSteps: StepFilter = () => true,
): ParsedTestInfo {
  const [testPath, ...testTitles] = testInfo.titlePath;

  if (testPath === undefined) {
    throw new Error("titlePath is empty");
  }

  if (!("_steps" in testInfo)) {
    throw new Error("Missing _steps in testInfo");
  }

  const { _steps } = testInfo as TestInfoInternal;
  const stepTitles = parseTestSteps(_steps).filter(filterSteps);

  return {
    testPath: parseTestPath(testPath),
    titlePath: [...testTitles, ...stepTitles],
  };
}

export function parseTestSteps(
  steps: ReadonlyArray<TestStepInternal>,
): Array<string> {
  const lastStep = steps.at(-1);
  if (lastStep === undefined || lastStep.category !== "test.step") {
    return [];
  }

  const nestedStepTitles = parseTestSteps(lastStep.steps);

  if (isExpectStep(lastStep)) {
    return nestedStepTitles;
  }

  return [lastStep.title, ...nestedStepTitles];
}

function isExpectStep(step: TestStepInternal): boolean {
  return step.apiName?.startsWith("expect") ?? false;
}

export function parseTestPath(testPath: string): string {
  return testPath.replace(/\.(test|spec)\.(js|ts|mjs)$/, "");
}
