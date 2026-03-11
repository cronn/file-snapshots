import { beforeEach, expect, test } from "vitest";

import type { TableCell } from "@cronn/lib-file-snapshots";
import { Table } from "@cronn/lib-file-snapshots";

import { registerValidationFileMatchers } from "../matchers/register-matchers";
import { testFilePathResolver } from "../utils/test";

beforeEach(() => registerValidationFileMatchers());

test("matches table with Markdown file", () => {
  expect(
    Table.define({
      columns: ["input", "output"],
      rows: [
        ["input 1", "output 1"],
        ["input 2", "output 2"],
      ],
    }),
  ).toMatchMarkdownTableFile();
});

test("when value cannot be serialized, throws error", () => {
  expect(() => expect("value").toMatchMarkdownTableFile()).toThrowError();
});

test("when matcher is inverted, throws error", () => {
  expect(() =>
    expect(
      Table.fromRecords([{ input: "output" }]),
    ).not.toMatchMarkdownTableFile(),
  ).toThrowError();
});

test("applies normalizer", () => {
  function maskNumber(value: TableCell): TableCell {
    if (typeof value !== "number") {
      return value;
    }

    return "[NUMBER]";
  }

  expect(Table.fromRecords([{ number: 4711 }])).toMatchMarkdownTableFile({
    normalizers: [maskNumber],
  });
});

test("applies name", () => {
  expect
    .soft(Table.fromRecords([{ value: "value 1" }]))
    .toMatchMarkdownTableFile({ name: "table 1" });
  expect
    .soft(Table.fromRecords([{ value: "value 2" }]))
    .toMatchMarkdownTableFile({ name: "table 2" });
});

test("applies custom file path resolver", () => {
  expect(Table.fromRecords([{ column: "value" }])).toMatchMarkdownTableFile({
    name: "name",
    resolveFilePath: testFilePathResolver,
  });
});
