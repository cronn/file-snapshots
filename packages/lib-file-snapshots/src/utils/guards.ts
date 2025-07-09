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
