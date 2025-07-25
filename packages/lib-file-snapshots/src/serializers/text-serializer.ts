import type { SnapshotSerializer } from "../types/serializer";
import { isString } from "../utils/guards";

export interface TextSerializerOptions {
  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: Array<TextNormalizer>;
}

export type TextNormalizer = (value: string) => string;

export class TextSerializer implements SnapshotSerializer {
  public readonly fileExtension = "txt";

  private readonly normalizers: Array<TextNormalizer>;

  public constructor(options: TextSerializerOptions = {}) {
    this.normalizers = options.normalizers ?? [];
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

    return this.normalizeValue(value);
  }

  private normalizeValue(value: string): string {
    let normalizedValue = value;

    for (const normalizer of this.normalizers) {
      normalizedValue = normalizer(normalizedValue);
    }

    return normalizedValue.trim();
  }
}
