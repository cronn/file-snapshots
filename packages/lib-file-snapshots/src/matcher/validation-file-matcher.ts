import * as fs from "node:fs";
import * as path from "node:path";

import type {
  SnapshotNamingStrategy,
  ValidationFileMatcherConfig,
  ValidationFileMatcherResult,
} from "../types/matcher";
import type { SnapshotSerializer } from "../types/serializer";
import {
  normalizeFileName,
  readSnapshotFile,
  writeSnapshotFile,
} from "../utils/file";

interface MatcherFilePaths {
  actualFile: string;
  validationFile: string;
}

export class ValidationFileMatcher {
  private readonly serializer: SnapshotSerializer;
  private readonly filePaths: MatcherFilePaths;
  private readonly validationFile: string | undefined;

  public constructor(config: ValidationFileMatcherConfig) {
    this.serializer = config.serializer;
    this.filePaths = this.buildFilePaths(config);
    this.validationFile = this.readValidationFile();
  }

  public matchFileSnapshot(actual: unknown): ValidationFileMatcherResult {
    if (!this.serializer.canSerialize(actual)) {
      throw new Error(`Cannot serialize value of type ${typeof actual}`);
    }

    const { actualFile, validationFile } = this.filePaths;
    const serializedActual = this.serializer.serialize(actual);

    writeSnapshotFile(actualFile, serializedActual);

    if (this.validationFile === undefined) {
      writeSnapshotFile(validationFile, serializedActual, true);

      return this.createMatcherResult({
        isValidationFileMissing: true,
      });
    }

    return this.createMatcherResult({
      isValidationFileMissing: false,
    });
  }

  private buildFilePaths(
    config: ValidationFileMatcherConfig,
  ): MatcherFilePaths {
    const validationDir = config.validationDir ?? "data/test/validation";
    const outputDir = config.outputDir ?? "data/test/output";
    const normalizedTitlePath = config.titlePath.map(normalizeFileName);
    const relativeFilePath = path.join(config.testPath, ...normalizedTitlePath);
    const relativeFilePathWithName = this.applyNamingStrategy(
      relativeFilePath,
      config.name,
      config.namingStrategy,
    );
    const relativeFilePathWithExtension = `${relativeFilePathWithName}.${this.serializer.fileExtension}`;

    return {
      actualFile: path.join(outputDir, relativeFilePathWithExtension),
      validationFile: path.join(validationDir, relativeFilePathWithExtension),
    };
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

  private readValidationFile(): string | undefined {
    const { validationFile } = this.filePaths;

    if (!fs.existsSync(validationFile)) {
      return undefined;
    }

    return readSnapshotFile(validationFile);
  }

  private createMatcherResult(
    params: Pick<ValidationFileMatcherResult, "isValidationFileMissing">,
  ): ValidationFileMatcherResult {
    const { actualFile, validationFile } = this.filePaths;

    return {
      ...params,
      actual: readSnapshotFile(actualFile),
      expected: readSnapshotFile(validationFile),
      actualFile,
      validationFile,
      message: () =>
        params.isValidationFileMissing
          ? `Missing validation file '${validationFile}'`
          : `Actual file '${actualFile}'\ndoes not match validation file '${validationFile}'`,
    };
  }
}
