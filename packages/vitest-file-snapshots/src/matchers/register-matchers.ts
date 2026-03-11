import type { ExpectationResult, MatcherState } from "@vitest/expect";
import { expect } from "vitest";

import {
  JsonSerializer,
  MarkdownTableSerializer,
  TextSerializer,
} from "@cronn/lib-file-snapshots";

import { matchValidationFile } from "./file-matcher";
import { parseTableData, parseTextValue } from "./parsers";
import type {
  VitestMatchJsonFileOptions,
  VitestMatchMarkdownTableFileOptions,
  VitestMatchTextFileOptions,
  VitestValidationFileMatcherConfig,
  VitestValidationFileMatchers,
} from "./types";

export function registerValidationFileMatchers(
  config: VitestValidationFileMatcherConfig = {},
): void {
  const { indentSize, ...snapshotConfig } = config;

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
        indentSize,
      }),
      config: snapshotConfig,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  function toMatchTextFile(
    this: MatcherState,
    received: unknown,
    options: VitestMatchTextFileOptions = {},
  ): ExpectationResult {
    const { normalizers, fileExtension, ...snapshotOptions } = options;
    return matchValidationFile({
      received: parseTextValue(received),
      serializer: new TextSerializer({ normalizers, fileExtension }),
      config: snapshotConfig,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  function toMatchMarkdownTableFile(
    this: MatcherState,
    received: unknown,
    options: VitestMatchMarkdownTableFileOptions = {},
  ): ExpectationResult {
    const { normalizers, ...snapshotOptions } = options;
    return matchValidationFile({
      received: parseTableData(received),
      serializer: new MarkdownTableSerializer({ normalizers }),
      config: snapshotConfig,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  expect.extend({
    toMatchJsonFile,
    toMatchTextFile,
    toMatchMarkdownTableFile,
  } satisfies VitestValidationFileMatchers);
}
