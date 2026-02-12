import path from "node:path";
import { beforeEach, describe, expect, test } from "vitest";

import type { FilePathResolverParams } from "@cronn/lib-file-snapshots";

import { registerValidationFileMatchers } from "../matchers/register-matchers";

describe("matcher configuration", () => {
  test("resolves test path relative to testDir", () => {
    registerValidationFileMatchers({
      testDir: "src",
    });

    expect("value").toMatchTextFile();
  });

  test("stores snapshots in custom directories", () => {
    registerValidationFileMatchers({
      validationDir: "custom-data/validation",
      outputDir: "custom-data/output",
    });

    expect("value").toMatchTextFile();
  });

  test("applies indentSize to JSON file snapshots", () => {
    registerValidationFileMatchers({
      indentSize: 4,
    });

    expect({ key: "value" }).toMatchJsonFile();
  });

  test("ignores indentSize in text file snapshots", () => {
    registerValidationFileMatchers({
      indentSize: 4,
    });

    expect("value").toMatchTextFile();
  });

  test("applies custom file path resolver", () => {
    registerValidationFileMatchers({
      resolveFilePath: testFilePathResolver,
    });

    expect("value").toMatchTextFile({ name: "name" });
  });
});

describe("JSON file matcher", () => {
  beforeEach(() => registerValidationFileMatchers());

  test("matches value with JSON file", () => {
    expect({
      key: "value",
    }).toMatchJsonFile();
  });

  test("when matcher is inverted, throws error", () => {
    expect(() => expect("value").not.toMatchJsonFile()).toThrowError();
  });

  test("when includeUndefinedObjectProperties is true, serializes undefined object properties", () => {
    expect({
      undefinedValue: undefined,
    }).toMatchJsonFile({ includeUndefinedObjectProperties: true });
  });

  test("applies normalizer", () => {
    function maskNumber(value: unknown): unknown {
      if (typeof value !== "number") {
        return value;
      }

      return "[NUMBER]";
    }

    expect({ number: 4711 }).toMatchJsonFile({ normalizers: [maskNumber] });
  });

  test("applies name", () => {
    expect.soft("value1").toMatchJsonFile({ name: "value 1" });
    expect.soft("value2").toMatchJsonFile({ name: "value 2" });
  });

  test("applies custom file path resolver", () => {
    expect("value").toMatchJsonFile({
      name: "name",
      resolveFilePath: testFilePathResolver,
    });
  });
});

describe("text file matcher", () => {
  beforeEach(() => registerValidationFileMatchers());

  test("matches value with text file", () => {
    expect("value").toMatchTextFile();
  });

  test("when matcher is inverted, throws error", () => {
    expect(() => expect("value").not.toMatchTextFile()).toThrowError();
  });

  test("applies normalizer", () => {
    function maskNumber(value: string): string {
      return value.replaceAll(/\d+/g, "[NUMBER]");
    }

    expect("4711").toMatchTextFile({ normalizers: [maskNumber] });
  });

  test("applies name", () => {
    expect.soft("value1").toMatchTextFile({ name: "value 1" });
    expect.soft("value2").toMatchTextFile({ name: "value 2" });
  });

  test("applies custom file path resolver", () => {
    expect("value").toMatchTextFile({
      name: "name",
      resolveFilePath: testFilePathResolver,
    });
  });

  test("applies custom file extension", () => {
    expect("# Heading").toMatchTextFile({
      fileExtension: "md",
    });
  });
});

export function testFilePathResolver(params: FilePathResolverParams): string {
  const { testPath, titlePath, name } = params;
  const normalizedTitlePath = path.join(
    ...titlePath.map((title) => title.replaceAll(" ", "-")),
  );
  return path.join(testPath, normalizedTitlePath, name ?? "");
}
