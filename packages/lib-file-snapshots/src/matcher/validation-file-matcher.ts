import * as fs from "node:fs";
import * as path from "node:path";

import type {
  UpdateSnapshotsType,
  ValidationFileMatcherConfig,
  ValidationFileMatcherResult,
} from "../types/matcher";
import type { SnapshotSerializer } from "../types/serializer";
import { readSnapshotFile, writeSnapshotFile } from "../utils/file";

interface MatcherFilePaths {
  outputFilePath: string;
  validationFilePath: string;
}

export class ValidationFileMatcher<TValue> {
  private readonly updateSnapshots: UpdateSnapshotsType;
  private readonly serializer: SnapshotSerializer<TValue>;
  private readonly filePaths: MatcherFilePaths;
  private validationFile: string | undefined;

  public constructor(config: ValidationFileMatcherConfig<TValue>) {
    this.updateSnapshots = config.updateSnapshots ?? "missing";
    this.serializer = config.serializer;
    this.filePaths = this.buildFilePaths(config);
    this.validationFile = this.readValidationFile();
  }

  public get isValidationFileMissing(): boolean {
    return this.validationFile === undefined;
  }

  public get isUpdate(): boolean {
    return (
      this.updateSnapshots === "all" ||
      (this.isValidationFileMissing && this.updateSnapshots === "missing")
    );
  }

  public matchFileSnapshot(actual: TValue): ValidationFileMatcherResult {
    const serializedActual = this.serializer.serialize(actual);
    const expected = this.resolveExpected();

    return this.createMatcherResult({
      actual: serializedActual,
      expected,
    });
  }

  private buildFilePaths(
    config: ValidationFileMatcherConfig<TValue>,
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
    const isValidationFileMissing = this.isValidationFileMissing;

    return {
      actual,
      expected,
      isValidationFileMissing,
      outputFilePath,
      validationFilePath,
      message: () =>
        isValidationFileMissing
          ? `Missing validation file '${validationFilePath}'`
          : `Output file '${outputFilePath}'\ndoes not match validation file '${validationFilePath}'`,
      writeFileSnapshots: () => this.writeFileSnapshots(params),
    };
  }

  private writeFileSnapshots(
    matcherResult: Pick<ValidationFileMatcherResult, "actual" | "expected">,
  ): void {
    const { actual } = matcherResult;
    const { outputFilePath, validationFilePath } = this.filePaths;

    writeSnapshotFile(outputFilePath, actual);

    if (this.isUpdate) {
      writeSnapshotFile(validationFilePath, actual);
      this.validationFile = actual;
    }
  }

  private resolveExpected(): string {
    return this.validationFile ?? "";
  }
}
