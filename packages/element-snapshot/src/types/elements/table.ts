import type { GenericElementSnapshot } from "../snapshot";
import type { SetValues } from "../utils";

export const SORT_TYPES = new Set([
  "ascending",
  "descending",
  "other",
] as const);

export interface ColumnHeaderSnapshot extends GenericElementSnapshot<
  "columnheader",
  ColumnheaderAttributes
> {}

interface ColumnheaderAttributes {
  sort?: SortType;
}

export type SortType = SetValues<typeof SORT_TYPES>;
