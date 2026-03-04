import { enumAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type {
  GenericElementSnapshot,
  SetValues,
  SnapshotTargetElement,
} from "./types";

export interface ColumnheaderSnapshot extends GenericElementSnapshot<
  "columnheader",
  ColumnheaderAttributes
> {}

interface ColumnheaderAttributes {
  sort?: SortType;
}

const SORT_TYPES = new Set(["ascending", "descending", "other"] as const);
export type SortType = SetValues<typeof SORT_TYPES>;

export function snapshotColumnheader(
  element: SnapshotTargetElement,
): ColumnheaderSnapshot {
  return {
    role: "columnheader",
    name: resolveAccessibleName(element),
    attributes: {
      sort: enumAttribute(element.ariaSort, SORT_TYPES),
    },
    children: snapshotChildren(element),
  };
}
