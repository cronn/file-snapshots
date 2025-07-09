import { describe, expect, test } from "vitest";

import { isArray, isPlainObject } from "./guards";

describe("is array", () => {
  test.each([{ value: [] }, { value: ["value"] }])(
    "$value is array",
    ({ value }) => {
      expect(isArray(value)).toBe(true);
    },
  );

  test.each([
    { value: undefined },
    { value: null },
    { value: {} },
    { value: { key: "value" } },
    { value: 4711 },
    { value: true },
    { value: new Date() },
  ])("$value is no array", ({ value }) => {
    expect(isArray(value)).toBe(false);
  });
});

describe("is plain object", () => {
  test.each([{ value: {} }, { value: { key: "value" } }])(
    "$value is plain object",
    ({ value }) => {
      expect(isPlainObject(value)).toBe(true);
    },
  );

  test.each([
    { value: undefined },
    { value: null },
    { value: [] },
    { value: ["value"] },
    { value: 4711 },
    { value: true },
    { value: new Date() },
  ])("%j is no plain object", ({ value }) => {
    expect(isPlainObject(value)).toBe(false);
  });
});
