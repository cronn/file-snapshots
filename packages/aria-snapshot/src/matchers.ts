import type {
  Expect,
  ExpectMatcherState,
  Locator,
  MatcherReturnType,
} from "@playwright/test";
import { expect as baseExpect } from "@playwright/test";

import type {
  PlaywrightValidationFileMatcherConfig,
  PlaywrightMatchJsonFileOptions,
} from "@cronn/playwright-file-snapshots";
import { defineJsonFileMatcher } from "@cronn/playwright-file-snapshots";

import { snapshotAria } from "./snapshot";
import type { AriaSnapshotMatchers } from "./types";

/**
 * Defines a custom Playwright expect instance with element snapshot matchers for validating DOM elements against stored snapshots.
 *
 * @param {PlaywrightValidationFileMatcherConfig} config - Configuration options for file matching behavior
 * @return {Expect<AriaSnapshotMatchers>} An extended expect instance that includes matcher methods for ARIA snapshot validation.
 */
export function defineAriaSnapshotMatchers(
  config: PlaywrightValidationFileMatcherConfig = {},
): Expect<AriaSnapshotMatchers> {
  async function toMatchAriaSnapshotFile(
    this: ExpectMatcherState,
    actual: Locator,
    options: PlaywrightMatchJsonFileOptions = {},
  ): Promise<MatcherReturnType> {
    const toMatchJsonFile = defineJsonFileMatcher(
      "toMatchAriaSnapshotFile",
      config,
    ).bind(this);
    return await toMatchJsonFile(() => snapshotAria(actual), options);
  }

  return baseExpect.extend({
    toMatchAriaSnapshotFile,
  });
}
