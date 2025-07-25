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

  public constructor(config: ValidationFileMatcherConfig) {
    this.serializer = config.serializer;
    this.filePaths = this.buildFilePaths(config);
  }

  public matchFileSnapshot(actual: unknown): ValidationFileMatcherResult {
    if (!this.serializer.canSerialize(actual)) {
      throw new Error(`Cannot serialize value of type ${typeof actual}`);
    }

    const { actualFile, validationFile } = this.filePaths;
    const serializedActual = this.serializer.serialize(actual);

    writeSnapshotFile(actualFile, serializedActual);

    if (this.existsValidationFile()) {
      return this.createMatcherResult({
        message: () =>
          `Actual file '${actualFile}'\ndoes not match validation file '${validationFile}'`,
      });
    }

    writeSnapshotFile(validationFile, serializedActual, true);

    return this.createMatcherResult({
      message: () => `Missing validation file '${validationFile}'`,
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

  private existsValidationFile(): boolean {
    return fs.existsSync(this.filePaths.validationFile);
  }

  private createMatcherResult(
    params: Pick<ValidationFileMatcherResult, "message">,
  ): ValidationFileMatcherResult {
    const { actualFile, validationFile } = this.filePaths;

    return {
      ...params,
      actual: readSnapshotFile(actualFile),
      expected: readSnapshotFile(validationFile),
      actualFile,
      validationFile,
    };
  }
}
