import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { DisableableAttributes, SelectableAttributes } from "./state";
import { disableableAttributes, selectableAttributes } from "./state";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface TabSnapshot
  extends GenericElementSnapshot<"tab", TabAttributes> {}

interface TabAttributes extends DisableableAttributes, SelectableAttributes {}

export function snapshotTab(
  element: SnapshotTargetElement,
): TabSnapshot | null {
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
