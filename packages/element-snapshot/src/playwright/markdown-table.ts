import type { Locator } from "@playwright/test";

import {
  MarkdownTableSerializer,
  type TableData,
  type TableRow,
} from "@cronn/lib-file-snapshots";

import type { ColumnHeaderSnapshot, SortType } from "../types/elements/table";
import type {
  ElementSnapshot,
  NodeRole,
  NodeSnapshot,
  SnapshotByRole,
} from "../types/snapshot";
import { filter, filterByRole } from "../utils/filter";
import { includeRole } from "../utils/predicates";

import { rawSnapshot } from "./snapshot";

const tableRoles = ["table", "grid"] satisfies Array<NodeRole>;

const cellRoles = ["rowheader", "cell", "gridcell"] satisfies Array<NodeRole>;

const sortIndicators: Record<SortType, string> = {
  ascending: "⯅",
  descending: "⯆",
  other: "⯁",
};

export interface MarkdownTableSnapshotOptions {
  /**
   * Show sort indicator for column headers
   *
   * @default true
   */
  showSortIndicator?: boolean;
}

/**
 * Creates a Markdown table snapshot from a table or grid element
 */
export async function markdownTableSnapshot(
  locator: Locator,
  options: MarkdownTableSnapshotOptions = {},
): Promise<string> {
  const elementSnapshot = await rawSnapshot(locator);
  const parsedTable = parseTable(elementSnapshot, options);

  return new MarkdownTableSerializer().serialize(parsedTable);
}

function parseTable(
  snapshot: Array<NodeSnapshot>,
  options: MarkdownTableSnapshotOptions,
): TableData {
  const { showSortIndicator = true } = options;

  const tableOrGridResult = filter({
    predicate: includeRole(tableRoles),
    snapshots: snapshot,
  });
  if (tableOrGridResult.length > 1) {
    throw new Error("Multiple tables or grids found");
  }

  const [tableOrGrid] = tableOrGridResult;
  if (tableOrGrid === undefined) {
    throw new Error("No table or grid found");
  }

  const [headerRow, ...bodyRows] = filterByRole("row", tableOrGrid.children);
  if (headerRow === undefined) {
    throw new Error("No header row found");
  }

  const columnHeaders = filterByRole("columnheader", headerRow.children);
  if (columnHeaders.length === 0) {
    throw new Error("No column headers found");
  }

  const columnHeaderTexts = columnHeaders.map((columnHeader) =>
    getColumnHeaderText(columnHeader, showSortIndicator),
  );
  const cellsTextsByRow = bodyRows.map(getCellTexts);

  return { columns: columnHeaderTexts, rows: cellsTextsByRow };
}

function getColumnHeaderText(
  columnHeader: ColumnHeaderSnapshot,
  showSortIndicator: boolean,
): string {
  const headerText = getNameOrDefault(columnHeader);
  const sortType = columnHeader.attributes.sort;

  if (!showSortIndicator || sortType === undefined) {
    return headerText;
  }

  const sortIndicator = sortIndicators[sortType];
  return `${headerText} ${sortIndicator}`;
}

function getCellTexts(row: SnapshotByRole<"row">): TableRow {
  return filter({
    predicate: includeRole(cellRoles),
    snapshots: row.children,
  }).map(getNameOrDefault);
}

function getNameOrDefault(snapshot: ElementSnapshot): string {
  return snapshot.name ?? "";
}
