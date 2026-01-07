import { snapshotChildren } from "./children";
import type { LinkAttributes } from "./link";
import { linkAttributes } from "./link";
import { resolveAccessibleName } from "./name";
import type { DisableableAttributes } from "./state";
import { disableableAttributes } from "./state";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface MenuitemSnapshot extends GenericElementSnapshot<
  "menuitem",
  MenuitemAttributes
> {}

interface MenuitemAttributes extends LinkAttributes, DisableableAttributes {}

export function snapshotMenuitem(
  element: SnapshotTargetElement,
): MenuitemSnapshot {
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
