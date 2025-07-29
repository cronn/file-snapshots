import type { SnapshotSerializer } from "../types/serializer";
import { addTrailingNewLine } from "../utils/file";
import { isArray, isPlainObject, isString } from "../utils/guards";

type JsonValue =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null;

export interface JsonSerializerOptions {
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

export type JsonNormalizer = (
  value: unknown,
  context: JsonNormalizerContext,
) => unknown;

export interface JsonNormalizerContext {
  key?: string;
  index?: number;
}

export class JsonSerializer implements SnapshotSerializer {
  public readonly fileExtension = "json";

  private readonly includeUndefinedObjectProperties: boolean;
  private readonly normalizers: Array<JsonNormalizer>;

  public constructor(options: JsonSerializerOptions = {}) {
    this.includeUndefinedObjectProperties =
      options.includeUndefinedObjectProperties ?? false;
    this.normalizers = options.normalizers ?? [];
  }

  public canSerialize(_value: unknown): boolean {
    return true;
  }

  public serialize(value: unknown): string {
    const jsonValue = this.normalizeValueRecursive(value);
    const jsonString = JSON.stringify(jsonValue, undefined, 2);
    return addTrailingNewLine(jsonString);
  }

  private normalizeValueRecursive(
    value: unknown,
    context?: JsonNormalizerContext,
  ): JsonValue {
    const customValue = this.applyCustomNormalizers(value, context);

    if (customValue === undefined) {
      return this.serializedValue("undefined");
    }

    if (
      customValue === null ||
      isString(customValue) ||
      typeof customValue === "boolean"
    ) {
      const isRoot = context === undefined;
      return isRoot
        ? this.serializedValue(typeof customValue, {
            value: customValue,
          })
        : customValue;
    }

    if (typeof customValue === "number") {
      return this.normalizeNumber(customValue);
    }

    if (typeof customValue === "bigint") {
      return this.serializedValue("bigint", {
        value: customValue.toString(),
      });
    }

    if (typeof customValue === "symbol") {
      return this.serializedValue("symbol", {
        description: customValue.description,
      });
    }

    if (typeof customValue === "function") {
      return this.serializedValue("function", { name: customValue.name });
    }

    if (typeof customValue === "object") {
      return this.normalizeObject(customValue);
    }

    throw new Error(
      `Missing JSON normalization for value of type ${typeof customValue}.`,
    );
  }

  private normalizeNumber(value: number): JsonValue {
    if (Number.isNaN(value)) {
      return this.serializedValue("number", { value: "Number.NaN" });
    }

    switch (value) {
      case Number.MIN_VALUE:
        return this.serializedValue("number", { value: "Number.MIN_VALUE" });
      case Number.MAX_VALUE:
        return this.serializedValue("number", { value: "Number.MAX_VALUE" });
      case Number.MIN_SAFE_INTEGER:
        return this.serializedValue("number", {
          value: "Number.MIN_SAFE_INTEGER",
        });
      case Number.MAX_SAFE_INTEGER:
        return this.serializedValue("number", {
          value: "Number.MAX_SAFE_INTEGER",
        });
      case Number.NEGATIVE_INFINITY:
        return this.serializedValue("number", {
          value: "Number.NEGATIVE_INFINITY",
        });
      case Number.POSITIVE_INFINITY:
        return this.serializedValue("number", {
          value: "Number.POSITIVE_INFINITY",
        });
      default:
        return value;
    }
  }

  private normalizeArray(value: Array<unknown>): JsonValue {
    return value.map((item, index) =>
      this.normalizeValueRecursive(item, { index }),
    );
  }

  private normalizeObject(value: object): JsonValue {
    if (isArray(value)) {
      return this.normalizeArray(value);
    }

    if (isPlainObject(value)) {
      return this.normalizePlainObject(value);
    }

    if (value instanceof Date) {
      return this.normalizeDate(value);
    }

    if (value instanceof Promise) {
      return this.serializedValue("Promise");
    }

    if (value instanceof Set) {
      return this.serializedValue("Set", {
        values: this.normalizeArray(Array.from(value.values())),
      });
    }

    if (value instanceof Map) {
      const mapAsObject = this.normalizeMap(value);
      return this.serializedValue("Map", {
        values: this.normalizePlainObject(mapAsObject),
      });
    }

    throw new Error(
      `Missing JSON normalization for object of type ${Object.getPrototypeOf(value)}`,
    );
  }

  private normalizeDate(value: Date): JsonValue {
    if (Number.isNaN(value.getTime())) {
      return this.serializedValue("Date", { value: "Invalid date" });
    }

    return this.serializedValue("Date", { value: value.toISOString() });
  }

  private normalizePlainObject(value: object): JsonValue {
    const normalizedObject: Record<string, unknown> = {};

    for (const [key, propertyValue] of Object.entries(value)) {
      if (
        propertyValue === undefined &&
        !this.includeUndefinedObjectProperties
      ) {
        continue;
      }

      this.assertKeyType(key);
      normalizedObject[key] = this.normalizeValueRecursive(propertyValue, {
        key,
      });
    }

    return normalizedObject;
  }

  private normalizeMap(value: Map<unknown, unknown>): Record<string, unknown> {
    return Array.from(value.entries()).reduce(
      (object, [key, value]) => {
        this.assertKeyType(key);
        object[key] = value;
        return object;
      },
      {} as Record<string, unknown>,
    );
  }

  private serializedValue(
    type: string,
    additionalProps: Partial<Record<string, JsonValue>> = {},
  ): JsonValue {
    return { $type: type, ...additionalProps };
  }

  private assertKeyType(key: unknown): asserts key is string {
    if (!isString(key)) {
      throw new Error(`Key of type ${typeof key} cannot be normalized.`);
    }
  }

  private applyCustomNormalizers(
    value: unknown,
    context: JsonNormalizerContext = {},
  ): unknown {
    let normalizedValue = value;

    for (const normalizer of this.normalizers) {
      normalizedValue = normalizer(normalizedValue, context);
    }

    return normalizedValue;
  }
}
