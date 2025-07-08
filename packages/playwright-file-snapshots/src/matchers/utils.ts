import type { TestInfo } from "@playwright/test";
import type {
  TestInfoInternal,
  TestStepInternal,
} from "../types/playwright-internals";
import type { StepFilter } from "./types";

export type RawTestInfo = Pick<TestInfo, "titlePath">;

interface ParsedTestInfo {
  testPath: string;
  titlePath: string[];
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
): string[] {
  const userDefinedSteps = steps.filter(
    (step) => step.category === "test.step",
  );
  const lastStep = userDefinedSteps.at(-1);

  if (lastStep === undefined) {
    return [];
  }

  return [lastStep.title, ...parseTestSteps(lastStep.steps)];
}

export function parseTestPath(testPath: string): string {
  return testPath.replace(/\.(test|spec)\.(js|ts|mjs)$/, "");
}
