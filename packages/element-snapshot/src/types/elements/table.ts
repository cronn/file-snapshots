import type { GenericElementSnapshot } from "../snapshot";
import type { SetValues } from "../utils";

export const SORT_TYPES = new Set([
  "ascending",
  "descending",
  "other",
] as const);

export interface ColumnHeaderSnapshot extends GenericElementSnapshot<
  "columnheader",
  ColumnHeaderAttributes
> {}

interface ColumnHeaderAttributes extends CellAttributes {
  sort?: SortType;
}

export type SortType = SetValues<typeof SORT_TYPES>;

export interface CellSnapshot extends GenericElementSnapshot<
  CellRole,
  CellAttributes
> {}

export type CellRole = "columnheader" | "rowheader" | "cell" | "gridcell";

export interface CellAttributes {
  colSpan?: number;
  rowSpan?: number;
}
