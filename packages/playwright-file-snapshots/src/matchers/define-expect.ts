import type {
  Expect,
  ExpectMatcherState,
  MatcherReturnType,
} from "@playwright/test";
import { expect as baseExpect } from "@playwright/test";

import { JsonSerializer, TextSerializer } from "@cronn/lib-file-snapshots";

import { matchValidationFile } from "./file-matcher";
import type {
  PlaywrightMatchJsonFileOptions,
  PlaywrightMatchTextFileOptions,
  PlaywrightValidationFileMatcherConfig,
  PlaywrightValidationFileMatchers,
  SnapshotValue,
} from "./types";

/**
 * Creates a custom Playwright expect object with validation file matchers for comparing test results against stored baseline files.
 * This function extends the base expect functionality with matchers for JSON and text file validation, allowing tests to verify
 * outputs against reference files stored in the file system.
 *
 * @param {PlaywrightValidationFileMatcherConfig} config - Configuration object for customizing the behavior of file validation matchers, such as file paths, update strategies, and comparison options. Defaults to an empty object if not provided.
 * @return {Expect<PlaywrightValidationFileMatchers>} An extended expect object that includes toMatchJsonFile and toMatchTextFile matcher methods for validating content against stored files.
 */
export function defineValidationFileExpect(
  config: PlaywrightValidationFileMatcherConfig = {},
): Expect<PlaywrightValidationFileMatchers> {
  return baseExpect.extend({
    toMatchJsonFile: defineJsonFileMatcher("toMatchJsonFile", config),
    toMatchTextFile: defineTextFileMatcher("toMatchTextFile", config),
  });
}

/**
 * Defines a custom JSON file matcher for Playwright test assertions.
 * Creates a matcher function that compares actual values against expected JSON snapshot files.
 *
 * @param matcherName - The name to identify this matcher in test assertions
 * @param config - Configuration object containing settings for the validation file matcher behavior
 * @return An async matcher function that validates actual values against JSON snapshot files and returns a matcher result
 */
export function defineJsonFileMatcher(
  matcherName: string,
  config: PlaywrightValidationFileMatcherConfig,
): PlaywrightValidationFileMatchers["toMatchJsonFile"] {
  return async function toMatchJsonFile(
    this: ExpectMatcherState,
    actual: SnapshotValue<unknown>,
    options: PlaywrightMatchJsonFileOptions = {},
  ): Promise<MatcherReturnType> {
    const {
      includeUndefinedObjectProperties,
      normalizers,
      ...snapshotOptions
    } = options;
    return await matchValidationFile({
      actual,
      matcherName,
      serializer: new JsonSerializer({
        includeUndefinedObjectProperties,
        normalizers,
        indentSize: config.indentSize,
      }),
      config,
      options: snapshotOptions,
      matcherState: this,
    });
  };
}

/**
 * Defines a custom text file matcher for Playwright validation that compares actual string values against stored text files.
 * The matcher serializes the actual value as text and performs snapshot-style comparisons with validation files.
 *
 * @param matcherName - The name to assign to the custom matcher for identification in test reports and error messages.
 * @param config - Configuration object containing settings for the validation file matcher behavior, such as file paths and comparison rules.
 * @return A matcher function that can be used to compare actual string values against text validation files, returning a promise that resolves to the match result.
 */
export function defineTextFileMatcher(
  matcherName: string,
  config: PlaywrightValidationFileMatcherConfig,
): PlaywrightValidationFileMatchers["toMatchTextFile"] {
  return async function toMatchTextFile(
    this: ExpectMatcherState,
    actual: SnapshotValue<string>,
    options: PlaywrightMatchTextFileOptions = {},
  ): Promise<MatcherReturnType> {
    const { normalizers, fileExtension, ...snapshotOptions } = options;
    return await matchValidationFile({
      actual,
      matcherName,
      serializer: new TextSerializer({ normalizers, fileExtension }),
      config,
      options: snapshotOptions,
      matcherState: this,
    });
  };
}
