import assert from "node:assert";

import type { PlainObject } from "@cronn/lib-file-snapshots";

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
