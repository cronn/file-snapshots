import { expect, test } from "vitest";

import { Table, type TableCell } from "@cronn/vitest-file-snapshots";

import {
  booleanAttribute,
  enumAttribute,
  booleanOrEnumAttribute,
  numericAttribute,
  stringAttribute,
} from "../browser/attribute";

test("string attribute", () => {
  const inputValues = [null, "value", ""];

  expect(
    attributeParserTable(inputValues, stringAttribute),
  ).toMatchMarkdownTableFile();
});

test("boolean attribute", () => {
  const inputValues = [null, true, false, "true", "false"];

  expect(
    attributeParserTable(inputValues, booleanAttribute),
  ).toMatchMarkdownTableFile();
});

test("numeric attribute", () => {
  const inputValues = [null, "4711", "value"];

  expect(
    attributeParserTable(inputValues, numericAttribute),
  ).toMatchMarkdownTableFile();
});

test("enum attribute", () => {
  const inputValues = [null, "enum", "other"];
  const enumValues = new Set(["enum"]);

  expect(
    attributeParserTable(inputValues, (value) =>
      enumAttribute(value, enumValues),
    ),
  ).toMatchMarkdownTableFile();
});

test("boolean or enum attribute", () => {
  const inputValues = [null, "true", "false", "enum", "other"];
  const enumValues = new Set(["enum"]);

  expect(
    attributeParserTable(inputValues, (value) =>
      booleanOrEnumAttribute(value, enumValues),
    ),
  ).toMatchMarkdownTableFile();
});

type AttributeValue = string | boolean | null;

function attributeParserTable<TValue extends AttributeValue>(
  inputValues: Array<TValue>,
  attributeParser: (value: TValue) => TableCell,
): Table {
  return Table.fromRecords(
    inputValues.map((value) => ({
      value: serializeValue(value),
      parsedValue: serializeValue(attributeParser(value)),
    })),
  );
}

function serializeValue(value: TableCell): TableCell {
  return typeof value === "string" ? `"${value}"` : value;
}
