import { describe, expect, test } from "vitest";

import {
  isNonNullish,
  isSingleItemArray,
  parseSinglePropertyObject,
  unwrapSingleItemArray,
} from "./utils";

describe("isNonNullish", () => {
  test.each([
    { value: true },
    { value: 4711 },
    { value: "string" },
    { value: {} },
    { value: [] },
  ])("$value is non nullish", ({ value }) => {
    expect(isNonNullish(value)).toBe(true);
  });

  test.each([{ value: undefined }, { value: null }])(
    "$value is nullish",
    ({ value }) => {
      expect(isNonNullish(value)).toBe(false);
    },
  );
});

describe("isSingleItemArray", () => {
  test("when array has exactly one item, returns true", () => {
    expect(isSingleItemArray(["item"])).toBe(true);
  });

  test("when array is empty, returns false", () => {
    expect(isSingleItemArray([])).toBe(false);
  });

  test("when array has more than one item, returns false", () => {
    expect(isSingleItemArray(["item 1", "item 2"])).toBe(false);
  });
});

test("returns first item from array", () => {
  expect(unwrapSingleItemArray(["item"])).toBe("item");
});

describe("parseSinglePropertyObject", () => {
  test("returns parsed single property object", () => {
    expect(parseSinglePropertyObject({ key: "value" })).toStrictEqual({
      key: "key",
      value: "value",
    });
  });

  test("when object contains no properties, throws error", () => {
    expect(() => parseSinglePropertyObject({})).toThrowError();
  });
});
