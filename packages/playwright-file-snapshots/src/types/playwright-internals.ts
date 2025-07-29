import type { TestInfo } from "@playwright/test";

/**
 * Playwright internal type definitions for accessing steps
 * https://github.com/microsoft/playwright/blob/main/packages/playwright/src/worker/testInfo.ts
 */

export interface TestInfoInternal extends TestInfo {
  readonly _steps: ReadonlyArray<TestStepInternal>; // make private _steps property accessible
}

export interface TestStepInternal {
  readonly title: string;
  readonly category: TestStepCategory;
  readonly apiName?: string;
  readonly steps: ReadonlyArray<TestStepInternal>;
}

type TestStepCategory =
  | "expect"
  | "fixture"
  | "hook"
  | "pw:api"
  | "test.step"
  | "test.attach";
