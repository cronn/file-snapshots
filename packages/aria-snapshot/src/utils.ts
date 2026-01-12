import assert from "node:assert";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value);
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null && !isArray(value);
}

export type PlainObject = Record<PropertyKey, unknown>;

export function isPlainObject(value: unknown): value is PlainObject {
  if (!isObject(value)) {
    return false;
  }

  const proto: unknown = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

export function isNonNullish(value: unknown): value is NonNullable<unknown> {
  return value !== undefined && value !== null;
}

export function isSingleItemArray(value: unknown): value is [unknown] {
  return Array.isArray(value) && value.length === 1;
}

export function unwrapSingleItemArray(value: [unknown]): unknown {
  return value[0];
}

export interface ParsedSinglePropertyObject<TValue = unknown> {
  key: string;
  value: TValue;
}

export function parseSinglePropertyObject(
  value: PlainObject,
): ParsedSinglePropertyObject {
  const [prop] = Object.entries(value);
  assert(prop !== undefined);
  const [propKey, propValue] = prop;
  return { key: propKey, value: propValue };
}
