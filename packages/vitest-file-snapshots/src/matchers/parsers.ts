import { Table } from "@cronn/lib-file-snapshots";

export function parseTextValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  throw new Error(
    `Value of type ${typeof value} cannot be parsed as text. Only strings are supported.`,
  );
}

export function parseTableData(value: unknown): Table {
  if (value instanceof Table) {
    return value as Table;
  }

  throw new Error("Value must be an instance of Table.");
}
