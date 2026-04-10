import type { MatcherReturnType } from "@playwright/test";

import type {
  FilePathResolver,
  JsonNormalizer,
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
   * Indentation size in spaces used for serializing snapshots
   *
   * @default 2
   */
  indentSize?: number;

  /**
   * Custom resolver for the file path used to store snapshots
   *
   * Should be unique for each test to avoid collisions
   *
   * @default resolveNameAsFile
   */
  resolveFilePath?: FilePathResolver;

  /**
   * Delay in ms before repeatable snapshots are created in update mode
   *
   * @default 250
   */
  updateDelay?: number;
}

export type SnapshotValue<TValue> =
  | StaticSnapshotValue<TValue>
  | RepeatableSnapshotValue<TValue>;

export type StaticSnapshotValue<TValue> = TValue | Promise<TValue>;

export type RepeatableSnapshotValue<TValue> = () => StaticSnapshotValue<TValue>;

export interface PlaywrightValidationFileMatchers {
  toMatchJsonFile: (
    actual: SnapshotValue<unknown>,
    options?: PlaywrightMatchJsonFileOptions,
  ) => Promise<MatcherReturnType>;
  toMatchTextFile: (
    actual: SnapshotValue<string>,
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
   * Retries the snapshot until it passes or the timeout value is reached.
   *
   * Defaults to Playwright's expect timeout.
   */
  timeout?: number;

  /**
   * Custom resolver for the file path used to store snapshots
   *
   * Should be unique for each test to avoid collisions
   *
   * @default resolveNameAsFile
   */
  resolveFilePath?: FilePathResolver;

  /**
   * Delay in ms before repeatable snapshots are created in update mode
   *
   * @default 250
   */
  updateDelay?: number;
}

export interface PlaywrightMatchTextFileOptions extends PlaywrightMatchValidationFileOptions {
  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: Array<TextNormalizer>;

  /**
   * File extension used for storing the snapshot file
   *
   * @default "txt"
   */
  fileExtension?: string;
}

export interface PlaywrightMatchJsonFileOptions extends PlaywrightMatchValidationFileOptions {
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
