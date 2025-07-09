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
} from "./types";

export function defineValidationFileExpect(
  config: PlaywrightValidationFileMatcherConfig = {},
): Expect<PlaywrightValidationFileMatchers> {
  function toMatchJsonFile(
    this: ExpectMatcherState,
    actual: unknown,
    options: PlaywrightMatchJsonFileOptions = {},
  ): MatcherReturnType {
    const {
      includeUndefinedObjectProperties,
      normalizers,
      ...snapshotOptions
    } = options;
    return matchValidationFile({
      actual,
      name: "toMatchJsonFile",
      serializer: new JsonSerializer({
        includeUndefinedObjectProperties,
        normalizers,
      }),
      config,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  function toMatchTextFile(
    this: ExpectMatcherState,
    actual: unknown,
    options: PlaywrightMatchTextFileOptions = {},
  ): MatcherReturnType {
    const { normalizers, ...snapshotOptions } = options;
    return matchValidationFile({
      actual,
      name: "toMatchTextFile",
      serializer: new TextSerializer({ normalizers }),
      config,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  return baseExpect.extend({
    toMatchJsonFile,
    toMatchTextFile,
  });
}
