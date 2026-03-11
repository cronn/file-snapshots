import { markdownTable } from "markdown-table";

import type { TableCell, TableData } from "../models/table";
import type { SnapshotSerializer } from "../types/serializer";
import { addTrailingNewLine } from "../utils/file";

export interface MarkdownTableSerializerOptions {
  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: Array<MarkdownTableNormalizer>;
}

export type MarkdownTableNormalizer = (value: TableCell) => TableCell;

export class MarkdownTableSerializer implements SnapshotSerializer<TableData> {
  public readonly fileExtension = "md";

  private readonly normalizers: Array<MarkdownTableNormalizer>;

  public constructor(options: MarkdownTableSerializerOptions = {}) {
    this.normalizers = options.normalizers ?? [];
  }

  public serialize(value: TableData): string {
    const { columns, rows } = value;
    if (columns.length === 0) {
      throw new Error("Markdown table must have at least one column.");
    }

    const normalizedRows = rows.map((row) =>
      row.map((cellValue) => this.serializeCellValue(cellValue)),
    );
    const serializedValue = markdownTable([columns, ...normalizedRows]);

    return addTrailingNewLine(serializedValue);
  }

  private serializeCellValue(value: TableCell): string {
    let normalizedValue = value;

    for (const normalizer of this.normalizers) {
      normalizedValue = normalizer(normalizedValue);
    }

    return this.mapCellValueToString(normalizedValue);
  }

  private mapCellValueToString(value: TableCell): string {
    if (value === undefined) {
      return "undefined";
    }

    if (value === null) {
      return "null";
    }

    return value.toString().trim();
  }
}
