import type { SnapshotSerializer } from "../types/serializer";
import { addTrailingNewLine } from "../utils/file";
import { isString } from "../utils/guards";

export interface TextSerializerOptions {
  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: Array<TextNormalizer>;

  /**
   * File extension used for storing the text file
   *
   * @default "txt"
   */
  fileExtension?: string;
}

export type TextNormalizer = (value: string) => string;

export class TextSerializer implements SnapshotSerializer {
  public readonly fileExtension;

  private readonly normalizers: Array<TextNormalizer>;

  public constructor(options: TextSerializerOptions = {}) {
    this.normalizers = options.normalizers ?? [];
    this.fileExtension = options.fileExtension ?? "txt";
  }

  public canSerialize(value: unknown): value is string {
    return isString(value);
  }

  public serialize(value: unknown): string {
    if (!this.canSerialize(value)) {
      throw new Error(
        `Missing text serialization for value of type ${typeof value}.`,
      );
    }

    const normalizedValue = this.normalizeValue(value);
    return addTrailingNewLine(normalizedValue);
  }

  private normalizeValue(value: string): string {
    let normalizedValue = value;

    for (const normalizer of this.normalizers) {
      normalizedValue = normalizer(normalizedValue);
    }

    return normalizedValue.trim();
  }
}
