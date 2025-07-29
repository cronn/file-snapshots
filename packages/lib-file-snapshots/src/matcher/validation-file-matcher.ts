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
  outputFilePath: string;
  validationFilePath: string;
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

    const { outputFilePath, validationFilePath } = this.filePaths;
    const serializedActual = this.serializer.serialize(actual);

    writeSnapshotFile(outputFilePath, serializedActual);

    if (this.validationFile === undefined) {
      writeSnapshotFile(validationFilePath, serializedActual, true);

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
      outputFilePath: path.join(outputDir, relativeFilePathWithExtension),
      validationFilePath: path.join(
        validationDir,
        relativeFilePathWithExtension,
      ),
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
    const { validationFilePath } = this.filePaths;

    if (!fs.existsSync(validationFilePath)) {
      return undefined;
    }

    return readSnapshotFile(validationFilePath);
  }

  private createMatcherResult(
    params: Pick<ValidationFileMatcherResult, "isValidationFileMissing">,
  ): ValidationFileMatcherResult {
    const { outputFilePath, validationFilePath } = this.filePaths;

    return {
      ...params,
      actual: readSnapshotFile(outputFilePath),
      expected: readSnapshotFile(validationFilePath),
      outputFilePath,
      validationFilePath,
      message: () =>
        params.isValidationFileMissing
          ? `Missing validation file '${validationFilePath}'`
          : `Output file '${outputFilePath}'\ndoes not match validation file '${validationFilePath}'`,
    };
  }
}
