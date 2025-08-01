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
   * The naming strategy to use for storing the file snapshot
   *
   * @default "file"
   */
  namingStrategy?: SnapshotNamingStrategy;

  /**
   * The serializer to use for the snapshot
   */
  serializer: SnapshotSerializer;
}

export type SnapshotNamingStrategy = "file" | "fileSuffix";

export interface ValidationFileMatcherResult {
  actual: string;
  expected: string;
  outputFilePath: string;
  validationFilePath: string;
  message: () => string;
  writeFileSnapshots: () => void;
}
