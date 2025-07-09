import type { SnapshotSerializer } from "./serializer";

export interface ValidationFileMatcherConfig {
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
}

export interface MatchValidationFileOptions {
  /**
   * The full path to the current test file
   *
   * @example "src/tests/feature.test.ts"
   */
  testPath: string;

  /**
   * The full path of titles describing the current test, including nested blocks
   *
   * @example ["test A", "when x, then y"]
   */
  titlePath: Array<string>;

  /**
   * Unique name of the file snapshot
   *
   * Used to distinguish multiple file snapshots within the same `test`.
   */
  name?: string;

  /**
   * The serializer to use for the snapshot
   */
  serializer: SnapshotSerializer;
}

export interface ValidationFileMeta {
  testPath: string;
  titlePath: Array<string>;
  name?: string;
  fileExtension: string;
}

export interface ValidationFileMatcherResult {
  actual: string;
  expected: string;
  actualFile: string;
  validationFile: string;
  message: () => string;
}
