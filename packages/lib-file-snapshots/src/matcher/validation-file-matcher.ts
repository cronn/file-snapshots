import * as fs from "node:fs";
import * as path from "node:path";

import type {
  MatchValidationFileOptions,
  SnapshotNamingStrategy,
  ValidationFileMatcherConfig,
  ValidationFileMatcherResult,
  ValidationFileMeta,
} from "../types/matcher";
import {
  mkdirRecursive,
  normalizeFileName,
  readSnapshotFile,
  writeSnapshotFile,
} from "../utils/file";

export class ValidationFileMatcher {
  private readonly validationDir: string;
  private readonly outputDir: string;

  public constructor(config: ValidationFileMatcherConfig = {}) {
    this.validationDir = config.validationDir ?? "data/test/validation";
    this.outputDir = config.outputDir ?? "data/test/output";
  }

  public matchFileSnapshot(
    actual: unknown,
    options: MatchValidationFileOptions,
  ): ValidationFileMatcherResult {
    const { testPath, titlePath, name, namingStrategy, serializer } = options;

    if (!serializer.canSerialize(actual)) {
      throw new Error(`Cannot serialize value of type ${typeof actual}`);
    }

    const serializerResult = serializer.serialize(actual);

    const validationFilePath = this.buildValidationFilePath({
      titlePath,
      testPath,
      name,
      namingStrategy,
      fileExtension: serializerResult.fileExtension,
    });

    return this.writeFileSnapshots(
      serializerResult.serializedValue,
      validationFilePath,
    );
  }

  private buildValidationFilePath(options: ValidationFileMeta): string {
    const { testPath, titlePath, name, namingStrategy, fileExtension } =
      options;

    const normalizedTitlePath = titlePath.map(normalizeFileName);
    const filePath = path.join(testPath, ...normalizedTitlePath);
    const fullFilePath = this.applyNamingStrategy(
      filePath,
      name,
      namingStrategy,
    );
    return `${fullFilePath}.${fileExtension}`;
  }

  private applyNamingStrategy(
    filePath: string,
    snapshotName: string | undefined,
    namingStrategy: SnapshotNamingStrategy = "file",
  ): string {
    if (snapshotName === undefined) {
      return filePath;
    }

    const normalizedSnapshotName = normalizeFileName(snapshotName);

    if (namingStrategy === "fileSuffix") {
      return `${filePath}_${normalizedSnapshotName}`;
    }

    return path.join(filePath, normalizedSnapshotName);
  }

  private writeFileSnapshots(
    actual: string,
    validationFilePath: string,
  ): ValidationFileMatcherResult {
    const validationFileDir = path.dirname(validationFilePath);
    const testOutputDir = `${this.outputDir}/${validationFileDir}`;
    const actualFile = `${this.outputDir}/${validationFilePath}`;

    const testValidationDir = `${this.validationDir}/${validationFileDir}`;
    const validationFile = `${this.validationDir}/${validationFilePath}`;

    mkdirRecursive(testOutputDir);
    mkdirRecursive(testValidationDir);

    if (!fs.existsSync(validationFile)) {
      writeSnapshotFile(validationFile, actual, true);
    }
    writeSnapshotFile(actualFile, actual);

    return {
      actual: readSnapshotFile(actualFile),
      expected: readSnapshotFile(validationFile),
      actualFile,
      validationFile,
      message: (): string =>
        `Actual file '${actualFile}'\ndoes not match validation file '${validationFile}'`,
    };
  }
}
