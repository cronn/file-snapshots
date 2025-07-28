import type { MatcherReturnType } from "@playwright/test";

import type {
  JsonNormalizer,
  SnapshotNamingStrategy,
  TextNormalizer,
} from "@cronn/lib-file-snapshots";

export interface PlaywrightValidationFileMatcherConfig {
  /**
   * Directory in which golden masters are stored
   *
   * @default "data/test/validation"
   */
  validationDir?: string;

  /**
   * Directory in which file snapshots from test runs are stored
   *
   * @default "data/test/output"
   */
  outputDir?: string;

  /**
   * Filter test steps which should not be part of the snapshot file path
   */
  filterSteps?: StepFilter;

  /**
   * Enable soft assertions
   *
   * @default true
   */
  soft?: boolean;
}

export type StepFilter = (stepTitle: string) => boolean;

export interface PlaywrightValidationFileMatchers {
  toMatchJsonFile: (
    actual: unknown,
    options?: PlaywrightMatchJsonFileOptions,
  ) => Promise<MatcherReturnType>;
  toMatchTextFile: (
    actual: string,
    options?: PlaywrightMatchTextFileOptions,
  ) => Promise<MatcherReturnType>;
}

export interface PlaywrightMatchValidationFileOptions {
  /**
   * Unique name of the file snapshot
   *
   * Used to distinguish multiple file snapshots within the same `test` or `test.step`.
   */
  name?: string;

  /**
   * The naming strategy to use for storing the file snapshot
   *
   * @default "file"
   */
  namingStrategy?: SnapshotNamingStrategy;

  /**
   * Retries the snapshot until it passes or the timeout value is reached.
   *
   * Defaults to Playwright's expect timeout.
   */
  timeout?: number;
}

export interface PlaywrightMatchTextFileOptions
  extends PlaywrightMatchValidationFileOptions {
  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: Array<TextNormalizer>;
}

export interface PlaywrightMatchJsonFileOptions
  extends PlaywrightMatchValidationFileOptions {
  /**
   * Serializes `undefined` properties in objects. By default, they are omitted.
   *
   * @default false
   */
  includeUndefinedObjectProperties?: boolean;

  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: Array<JsonNormalizer>;
}
