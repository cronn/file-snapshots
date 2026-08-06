import type { TreeItemSnapshot } from "../types/elements/tree";

import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import {
  checkableAttributes,
  disableableAttributes,
  expandableAttributes,
  selectableAttributes,
} from "./state";
import type { SnapshotTargetElement } from "./types";

export function snapshotTreeItem(
  element: SnapshotTargetElement,
): TreeItemSnapshot {
  return {
    role: "treeitem",
    name: resolveAccessibleName(element),
    attributes: {
      ...disableableAttributes(element),
      ...checkableAttributes(element),
      ...selectableAttributes(element),
      ...expandableAttributes(element),
    },
    children: snapshotChildren(element),
  };
}
