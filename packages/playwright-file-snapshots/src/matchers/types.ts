import type { JsonNormalizer, TextNormalizer } from "@cronn/lib-file-snapshots";
import type { MatcherReturnType } from "@playwright/test";

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
}

export type StepFilter = (stepTitle: string) => boolean;

export interface PlaywrightValidationFileMatchers {
  toMatchJsonFile: (
    actual: unknown,
    options?: PlaywrightMatchJsonFileOptions,
  ) => MatcherReturnType;
  toMatchTextFile: (
    actual: string,
    options?: PlaywrightMatchTextFileOptions,
  ) => MatcherReturnType;
}

export interface PlaywrightMatchValidationFileOptions {
  /**
   * Unique name of the file snapshot
   *
   * Used to distinguish multiple file snapshots within the same `test` or `test.step`.
   */
  name?: string;
}

export interface PlaywrightMatchTextFileOptions
  extends PlaywrightMatchValidationFileOptions {
  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: TextNormalizer[];
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
  normalizers?: JsonNormalizer[];
}
