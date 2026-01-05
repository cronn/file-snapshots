import type {
  FilePathResolver,
  JsonNormalizer,
  TextNormalizer,
} from "@cronn/lib-file-snapshots";

export interface VitestValidationFileMatchers<R = unknown> {
  toMatchTextFile: (options?: VitestMatchTextFileOptions) => R;
  toMatchJsonFile: (options?: VitestMatchJsonFileOptions) => R;
}

export interface VitestMatchValidationFileOptions {
  /**
   * Unique name of the file snapshot
   *
   * Used to distinguish multiple file snapshots within the same `test`.
   */
  name?: string;

  /**
   * Custom resolver for the file path used to store snapshots
   *
   * Should be unique for each test to avoid collisions
   *
   * @default resolveNameAsFile
   */
  resolveFilePath?: FilePathResolver;
}

export interface VitestMatchTextFileOptions extends VitestMatchValidationFileOptions {
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

export interface VitestMatchJsonFileOptions extends VitestMatchValidationFileOptions {
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

export interface VitestValidationFileMatcherConfig {
  /**
   * Base directory for tests
   *
   * The paths of snapshot files will be relative to this directory.
   * @default "."
   */
  testDir?: string;

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
}
