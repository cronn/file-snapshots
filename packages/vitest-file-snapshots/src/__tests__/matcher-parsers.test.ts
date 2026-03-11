import { describe, expect, test } from "vitest";

import { Table } from "@cronn/lib-file-snapshots";

import { parseTableData, parseTextValue } from "../matchers/parsers";

describe("parseTextValue", () => {
  test("when value is of type string, returns value", () =>
    expect(parseTextValue("value")).toBe("value"));

  test("when value is not of type string, throws error", () =>
    expect(() => parseTextValue(["value"])).toThrow());
});

describe("parseTableData", () => {
  test("when value is instance of table, returns value", () => {
    const value = Table.define({
      columns: ["column"],
      rows: [["text"], [4711], [true], [null], [undefined]],
    });

    expect(parseTableData(value)).toBe(value);
  });

  test("when value is not instance of table, throws error", () =>
    expect(() =>
      parseTableData({
        columns: ["column"],
        rows: [["text"], [4711], [true], [null], [undefined]],
      }),
    ).toThrow());
});
