import { describe, expect, test } from "vitest";

import {
  booleanAttribute,
  enumAttribute,
  numericAttribute,
  stringAttribute,
} from "../browser/attribute";

describe("string attribute", () => {
  test("when value is non-empty string, returns value", () => {
    expect(stringAttribute("value")).toBe("value");
  });

  test("when value is empty string, returns undefined", () => {
    expect(stringAttribute(null)).toBeUndefined();
  });

  test("when value is null, returns undefined", () => {
    expect(stringAttribute(null)).toBeUndefined();
  });
});

describe("boolean attribute", () => {
  test("when value is true, returns true", () => {
    expect(booleanAttribute(true)).toBe(true);
  });

  test("when value is 'true', returns true", () => {
    expect(booleanAttribute("true")).toBe(true);
  });

  test("when value is false, returns undefined", () => {
    expect(booleanAttribute(false)).toBeUndefined();
  });

  test("when value is 'false', returns undefined", () => {
    expect(booleanAttribute("false")).toBeUndefined();
  });

  test("when value is null, returns undefined", () => {
    expect(booleanAttribute("false")).toBeUndefined();
  });
});

describe("numeric attribute", () => {
  test("when value represents a number, returns numeric value", () => {
    expect(numericAttribute("4711")).toBe(4711);
  });

  test("when value does not represent a number, returns undefined", () => {
    expect(numericAttribute("value")).toBeUndefined();
  });

  test("when value is null, returns undefined", () => {
    expect(numericAttribute(null)).toBeUndefined();
  });
});

describe("enum attribute", () => {
  test("when value exists in enum, returns value", () => {
    expect(enumAttribute("supported", new Set(["supported"]))).toBe(
      "supported",
    );
  });

  test("when value does not exist in enum, returns undefined", () => {
    expect(
      enumAttribute("unsupported", new Set(["supported"])),
    ).toBeUndefined();
  });

  test("when value is null, returns undefined", () => {
    expect(enumAttribute(null, new Set<string>())).toBeUndefined();
  });
});
