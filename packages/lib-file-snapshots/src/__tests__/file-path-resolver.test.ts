import path from "node:path";
import { describe, expect, test } from "vitest";

import {
  resolveNameAsFile,
  resolveNameAsFileSuffix,
} from "../matcher/file-path-resolver";

describe("resolveNameAsFile", () => {
  test("when name is undefined, returns path including testPath and titlePath", () => {
    expect(
      resolveNameAsFile({
        testPath: "tests/feature",
        titlePath: ["test", "when x, then y"],
      }),
    ).toBe(path.join("tests", "feature", "test", "when_x_then_y"));
  });

  test("when name is defined, returns path including testPath and titlePath with name as file", () => {
    expect(
      resolveNameAsFile({
        testPath: "tests/feature",
        titlePath: ["test", "when x, then y"],
        name: "name",
      }),
    ).toBe(path.join("tests", "feature", "test", "when_x_then_y", "name"));
  });
});

describe("resolveNameAsFileSuffix", () => {
  test("when name is undefined, returns path including testPath and titlePath", () => {
    expect(
      resolveNameAsFileSuffix({
        testPath: "tests/feature",
        titlePath: ["test", "when x, then y"],
      }),
    ).toBe(path.join("tests", "feature", "test", "when_x_then_y"));
  });

  test("when name is defined, returns path including testPath and titlePath with name as suffix", () => {
    expect(
      resolveNameAsFileSuffix({
        testPath: "tests/feature",
        titlePath: ["test", "when x, then y"],
        name: "name",
      }),
    ).toBe(path.join("tests", "feature", "test", "when_x_then_y_name"));
  });
});
