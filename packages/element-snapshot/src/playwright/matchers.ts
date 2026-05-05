import type {
  Expect,
  ExpectMatcherState,
  Locator,
  MatcherReturnType,
} from "@playwright/test";
import { expect as baseExpect } from "@playwright/test";

import type { PlaywrightValidationFileMatcherConfig } from "@cronn/playwright-file-snapshots";
import {
  defineJsonFileMatcher,
  defineTextFileMatcher,
} from "@cronn/playwright-file-snapshots";

import type {
  ElementSnapshotMatchers,
  MatchMarkdownTableSnapshotFileOptions,
  MatchSemanticSnapshotFileOptions,
} from "../types/matchers";

import { markdownTableSnapshot } from "./markdown-table";
import { semanticSnapshot } from "./snapshot";

/**
 * Defines a custom Playwright expect instance with element snapshot matchers for validating DOM elements against stored snapshots.
 *
 * @param {PlaywrightValidationFileMatcherConfig} config - Configuration options for file matching behavior
 * @return {Expect<ElementSnapshotMatchers>} An extended expect instance that includes matcher methods for element snapshot validation.
 */
export function defineElementSnapshotExpect(
  config: PlaywrightValidationFileMatcherConfig = {},
): Expect<ElementSnapshotMatchers> {
  async function toMatchSemanticSnapshotFile(
    this: ExpectMatcherState,
    actual: Locator,
    options: MatchSemanticSnapshotFileOptions = {},
  ): Promise<MatcherReturnType> {
    const toMatchJsonFile = defineJsonFileMatcher(
      "toMatchSemanticSnapshotFile",
      config,
    ).bind(this);
    return await toMatchJsonFile(
      () => semanticSnapshot(actual, options),
      options,
    );
  }

  async function toMatchMarkdownTableSnapshotFile(
    this: ExpectMatcherState,
    actual: Locator,
    options: MatchMarkdownTableSnapshotFileOptions = {},
  ): Promise<MatcherReturnType> {
    const toMatchTextFile = defineTextFileMatcher(
      "toMatchMarkdownTableSnapshotFile",
      config,
    ).bind(this);
    return await toMatchTextFile(() => markdownTableSnapshot(actual, options), {
      ...options,
      fileExtension: "md",
    });
  }

  return baseExpect.extend({
    toMatchSemanticSnapshotFile,
    toMatchMarkdownTableSnapshotFile,
  });
}
