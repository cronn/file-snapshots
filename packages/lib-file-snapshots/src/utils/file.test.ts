import { describe, expect, test } from "vitest";

import { normalizeFileName } from "./file";

describe("normalize file name", () => {
  test.each([" ", ".", ":", "'"])("replaces '%s' by underscore", (value) => {
    expect(normalizeFileName(value)).toBe("_");
  });

  test.each([",", "$"])("removes '%s' from test name", (value) => {
    expect(normalizeFileName(value)).toBe("");
  });

  test("unwraps quoted value", () => {
    expect(normalizeFileName(`'value with 1 number'`)).toBe(
      "value_with_1_number",
    );
  });

  test("removes plus from positive zero", () => {
    expect(normalizeFileName("+0")).toBe("0");
  });
});
