import type { SnapshotSerializer } from "./serializer";

export interface ValidationFileMatcherConfig {
  /**
   * Directory in which golden masters are stored
   */
  validationDir: string;

  /**
   * Directory in which file snapshots from test runs are stored
   */
  outputDir: string;

  /**
   * The full path to the snapshot file
   *
   * @example "src/tests/feature/test/when_x_then_y"
   */
  filePath: string;

  /**
   * The serializer to use for the snapshot
   */
  serializer: SnapshotSerializer;

  /**
   * Whether to update golden masters with the actual result.
   *
   * @default "missing"
   */
  updateSnapshots?: UpdateSnapshotsType;
}

export type UpdateSnapshotsType = "all" | "missing" | "none";

export interface ValidationFileMatcherResult {
  actual: string;
  expected: string;
  outputFilePath: string;
  validationFilePath: string;
  message: () => string;
  writeFileSnapshots: () => void;
}

export type FilePathResolver = (params: FilePathResolverParams) => string;

export interface FilePathResolverParams {
  testPath: string;
  titlePath: Array<string>;
  name?: string;
}
