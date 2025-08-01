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
  const { soft = true, ...snapshotConfig } = config;

  async function toMatchJsonFile(
    this: ExpectMatcherState,
    actual: unknown,
    options: PlaywrightMatchJsonFileOptions = {},
  ): Promise<MatcherReturnType> {
    const {
      includeUndefinedObjectProperties,
      normalizers,
      ...snapshotOptions
    } = options;
    return await matchValidationFile({
      actual,
      matcherName: "toMatchJsonFile",
      serializer: new JsonSerializer({
        includeUndefinedObjectProperties,
        normalizers,
      }),
      config: snapshotConfig,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  async function toMatchTextFile(
    this: ExpectMatcherState,
    actual: unknown,
    options: PlaywrightMatchTextFileOptions = {},
  ): Promise<MatcherReturnType> {
    const { normalizers, ...snapshotOptions } = options;
    return await matchValidationFile({
      actual,
      matcherName: "toMatchTextFile",
      serializer: new TextSerializer({ normalizers }),
      config: snapshotConfig,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  return baseExpect
    .configure({
      soft,
    })
    .extend({
      toMatchJsonFile,
      toMatchTextFile,
    });
}
