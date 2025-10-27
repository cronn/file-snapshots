import path from "node:path";
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
      path.join("src", "tests", "feature"),
    );
  });

  test("removes __tests__ directory from test path", () => {
    expect(parseTestPath("src/__tests__/feature.test.ts", ".")).toBe(
      path.join("src", "feature"),
    );
  });

  test("does not remove directory partially matching __tests__ from test path", () => {
    expect(parseTestPath("src/x__tests__/feature.test.ts", ".")).toBe(
      path.join("src", "x__tests__", "feature"),
    );
  });

  test("resolves test path relative to testDir", () => {
    expect(parseTestPath("src/tests/feature.test.ts", "src/tests")).toBe(
      "feature",
    );
  });
});
