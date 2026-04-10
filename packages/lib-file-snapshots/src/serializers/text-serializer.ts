import type { SnapshotSerializer } from "../types/serializer";
import { addTrailingNewLine } from "../utils/file";

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

export class TextSerializer implements SnapshotSerializer<string> {
  public readonly fileExtension;

  private readonly normalizers: Array<TextNormalizer>;

  public constructor(options: TextSerializerOptions = {}) {
    this.normalizers = options.normalizers ?? [];
    this.fileExtension = options.fileExtension ?? "txt";
  }

  public serialize(value: string): string {
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
