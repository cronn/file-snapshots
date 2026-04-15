import type { MenuItemSnapshot } from "../types/elements/list";

import { snapshotChildren } from "./children";
import { linkAttributes } from "./link";
import { resolveAccessibleName } from "./name";
import { disableableAttributes } from "./state";
import type { SnapshotTargetElement } from "./types";

export function snapshotMenuitem(
  element: SnapshotTargetElement,
): MenuItemSnapshot {
  return {
    role: "menuitem",
    name: resolveAccessibleName(element),
    attributes: {
      ...linkAttributes(element),
      ...disableableAttributes(element),
    },
    children: snapshotChildren(element),
  };
}
