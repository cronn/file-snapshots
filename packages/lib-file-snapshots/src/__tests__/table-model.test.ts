import { expect, test } from "vitest";

import type { TableData } from "../models/table";
import { Table } from "../models/table";

test("returns defined table data", () => {
  const table: TableData = {
    columns: ["column 1", "column 2"],
    rows: [
      ["cell 1", "cell 2"],
      ["cell 3", "cell 4"],
    ],
  };

  expect(Table.define(table)).toEqual(table);
});

test("maps record-based rows to table data", () => {
  expect(
    Table.fromRecords([
      { column1: "cell 1", column2: "cell 2" },
      { column1: "cell 3", column2: "cell 4" },
    ]),
  ).toEqual({
    columns: ["column1", "column2"],
    rows: [
      ["cell 1", "cell 2"],
      ["cell 3", "cell 4"],
    ],
  });
});

test("when record-based rows are empty, returns empty table data", () => {
  expect(Table.fromRecords([])).toEqual({
    columns: [],
    rows: [],
  });
});
