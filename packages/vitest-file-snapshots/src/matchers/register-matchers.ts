import type { ExpectationResult, MatcherState } from "@vitest/expect";
import { expect } from "vitest";

import { JsonSerializer, TextSerializer } from "@cronn/lib-file-snapshots";

import { matchValidationFile } from "./file-matcher";
import type {
  VitestMatchJsonFileOptions,
  VitestMatchTextFileOptions,
  VitestValidationFileMatcherConfig,
  VitestValidationFileMatchers,
} from "./types";

export function registerValidationFileMatchers(
  config: VitestValidationFileMatcherConfig = {},
): void {
  function toMatchJsonFile(
    this: MatcherState,
    received: unknown,
    options: VitestMatchJsonFileOptions = {},
  ): ExpectationResult {
    const {
      includeUndefinedObjectProperties,
      normalizers,
      ...snapshotOptions
    } = options;
    return matchValidationFile({
      received,
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
    this: MatcherState,
    received: unknown,
    options: VitestMatchTextFileOptions = {},
  ): ExpectationResult {
    const { normalizers, ...snapshotOptions } = options;
    return matchValidationFile({
      received,
      serializer: new TextSerializer({ normalizers }),
      config,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  expect.extend({
    toMatchJsonFile,
    toMatchTextFile,
  } satisfies VitestValidationFileMatchers);
}
