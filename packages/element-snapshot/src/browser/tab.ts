import type { TabSnapshot } from "../types/elements/tab";

import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import { disableableAttributes, selectableAttributes } from "./state";
import type { SnapshotTargetElement } from "./types";

export function snapshotTab(element: SnapshotTargetElement): TabSnapshot {
  return {
    role: "tab",
    name: resolveAccessibleName(element),
    attributes: {
      ...disableableAttributes(element),
      ...selectableAttributes(element),
    },
    children: snapshotChildren(element),
  };
}
