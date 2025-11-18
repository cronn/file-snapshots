import { enumAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type {
  GenericElementSnapshot,
  SetValues,
  SnapshotTargetElement,
} from "./types";

export interface ColumnheaderSnapshot
  extends GenericElementSnapshot<"columnheader", ColumnheaderAttributes> {}

interface ColumnheaderAttributes {
  sort?: SortAttribute;
}

const SORT_ATTRIBUTES = new Set(["ascending", "descending", "other"] as const);
type SortAttribute = SetValues<typeof SORT_ATTRIBUTES>;

export function snapshotColumnheader(
  element: SnapshotTargetElement,
): ColumnheaderSnapshot {
  return {
    role: "columnheader",
    name: resolveAccessibleName(element),
    attributes: {
      sort: enumAttribute(element.ariaSort, SORT_ATTRIBUTES),
    },
    children: snapshotChildren(element),
  };
}
