import { enumAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

const SORT_ATTRIBUTES = ["ascending", "descending", "other"] as const;
type SortAttribute = (typeof SORT_ATTRIBUTES)[number];

export interface ColumnheaderSnapshot
  extends GenericElementSnapshot<"columnheader", ColumnheaderAttributes> {}

interface ColumnheaderAttributes {
  sort?: SortAttribute;
}

const SORT_ATTRIBUTES_SET = new Set(SORT_ATTRIBUTES);

export function snapshotColumnheader(
  element: SnapshotTargetElement,
): ColumnheaderSnapshot {
  return {
    role: "columnheader",
    name: resolveAccessibleName(element),
    attributes: {
      sort: enumAttribute(element.ariaSort, SORT_ATTRIBUTES_SET),
    },
    children: snapshotChildren(element),
  };
}
