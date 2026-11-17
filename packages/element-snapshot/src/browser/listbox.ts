import type { ListboxSnapshot } from "../types/elements/input";

import { snapshotChildren } from "./children";
import { snapshotCommonInputAttributes } from "./input";
import { resolveAccessibleName } from "./name";
import { expandableAttributes, multiselectableAttributes } from "./state";
import type { SnapshotTargetElement } from "./types";

export function snapshotListbox(
  element: SnapshotTargetElement,
): ListboxSnapshot {
  return {
    role: "listbox",
    name: resolveAccessibleName(element),
    attributes: {
      ...multiselectableAttributes(element),
      ...snapshotCommonInputAttributes(element),
      ...expandableAttributes(element),
    },
    children: snapshotChildren(element),
  };
}
