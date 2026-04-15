import type { ColumnHeaderSnapshot } from "../types/elements/table";
import { SORT_TYPES } from "../types/elements/table";

import { enumAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

export function snapshotColumnHeader(
  element: SnapshotTargetElement,
): ColumnHeaderSnapshot {
  return {
    role: "columnheader",
    name: resolveAccessibleName(element),
    attributes: {
      sort: enumAttribute(element.ariaSort, SORT_TYPES),
    },
    children: snapshotChildren(element),
  };
}
