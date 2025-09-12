import * as fs from "node:fs";
import * as path from "node:path";

import type {
  ValidationFileMatcherConfig,
  ValidationFileMatcherResult,
} from "../types/matcher";
import type { SnapshotSerializer } from "../types/serializer";
import {
  addMissingFileMarker,
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

  public get isValidationFileMissing(): boolean {
    return this.validationFile === undefined;
  }

  public matchFileSnapshot(actual: unknown): ValidationFileMatcherResult {
    if (!this.serializer.canSerialize(actual)) {
      throw new Error(`Cannot serialize value of type ${typeof actual}`);
    }

    const serializedActual = this.serializer.serialize(actual);

    if (this.validationFile === undefined) {
      return this.createMatcherResult({
        actual: serializedActual,
        expected: addMissingFileMarker(serializedActual),
      });
    }

    return this.createMatcherResult({
      actual: serializedActual,
      expected: this.validationFile,
    });
  }

  private buildFilePaths(
    config: ValidationFileMatcherConfig,
  ): MatcherFilePaths {
    const { validationDir, outputDir, filePath, serializer } = config;
    const filePathWithExtension = `${filePath}.${serializer.fileExtension}`;

    return {
      outputFilePath: path.join(outputDir, filePathWithExtension),
      validationFilePath: path.join(validationDir, filePathWithExtension),
    };
  }

  private readValidationFile(): string | undefined {
    const { validationFilePath } = this.filePaths;

    if (!fs.existsSync(validationFilePath)) {
      return undefined;
    }

    return readSnapshotFile(validationFilePath);
  }

  private createMatcherResult(
    params: Pick<ValidationFileMatcherResult, "actual" | "expected">,
  ): ValidationFileMatcherResult {
    const { actual, expected } = params;
    const { outputFilePath, validationFilePath } = this.filePaths;

    return {
      actual,
      expected,
      outputFilePath,
      validationFilePath,
      message: () =>
        this.isValidationFileMissing
          ? `Missing validation file '${validationFilePath}'`
          : `Output file '${outputFilePath}'\ndoes not match validation file '${validationFilePath}'`,
      writeFileSnapshots: () => this.writeFileSnapshots(params),
    };
  }

  private writeFileSnapshots(
    matcherResult: Pick<ValidationFileMatcherResult, "actual" | "expected">,
  ): void {
    const { actual, expected } = matcherResult;
    const { outputFilePath, validationFilePath } = this.filePaths;

    writeSnapshotFile(outputFilePath, actual);

    if (this.isValidationFileMissing) {
      writeSnapshotFile(validationFilePath, expected);
    }
  }
}
