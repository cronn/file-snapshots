import { describe, expect, test } from "vitest";

import { parseTestName, parseTestPath } from "./utils";

describe("parseTestName", () => {
  test("splits test name into titles", () => {
    expect(parseTestName("a > b > c")).toStrictEqual(["a", "b", "c"]);
  });
});

describe("parseTestPath", () => {
  test.each([
    ".test.ts",
    ".test.js",
    ".test.tsx",
    ".test.jsx",
    ".test.mts",
    ".test.mjs",
    ".test.cts",
    ".test.cjs",
    ".spec.ts",
    ".spec.js",
    ".spec.tsx",
    ".spec.jsx",
    ".spec.mts",
    ".spec.mjs",
    ".spec.cts",
    ".spec.cjs",
  ])("removes test extension %s from test path", (testExtension) => {
    expect(parseTestPath(`src/tests/feature${testExtension}`, ".")).toBe(
      "src/tests/feature",
    );
  });

  test("resolves test path relative to testDir", () => {
    expect(parseTestPath("src/tests/feature.test.ts", "src/tests")).toBe(
      "feature",
    );
  });
});
