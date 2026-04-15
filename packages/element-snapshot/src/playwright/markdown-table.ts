import type { Locator } from "@playwright/test";
import { markdownTable } from "markdown-table";

import type { ColumnHeaderSnapshot, SortType } from "../types/elements/table";
import type { NodeRole, NodeSnapshot, SnapshotByRole } from "../types/snapshot";
import { filter, filterByRole } from "../utils/filter";
import { includeRole } from "../utils/predicates";
import { getTextContent } from "../utils/text";

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
  const { columnHeaders, rows } = parseTable(elementSnapshot, options);

  return markdownTable([columnHeaders, ...rows]);
}

interface ParsedTable {
  columnHeaders: Array<string>;
  rows: Array<RowCells>;
}

type RowCells = Array<string>;

function parseTable(
  snapshot: Array<NodeSnapshot>,
  options: MarkdownTableSnapshotOptions,
): ParsedTable {
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

  return { columnHeaders: columnHeaderTexts, rows: cellsTextsByRow };
}

function getColumnHeaderText(
  columnHeader: ColumnHeaderSnapshot,
  showSortIndicator: boolean,
): string {
  const headerText = getTextContent([columnHeader]);
  const sortType = columnHeader.attributes.sort;

  if (!showSortIndicator || sortType === undefined) {
    return headerText;
  }

  const sortIndicator = sortIndicators[sortType];
  return `${headerText} ${sortIndicator}`;
}

function getCellTexts(row: SnapshotByRole<"row">): RowCells {
  return filter({
    predicate: includeRole(cellRoles),
    snapshots: row.children,
  }).map((cell) => getTextContent(cell.children));
}
