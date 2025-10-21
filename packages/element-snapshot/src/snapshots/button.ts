import { booleanAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { DisableableAttributes } from "./state";
import { disableableAttributes } from "./state";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ButtonSnapshot
  extends GenericElementSnapshot<"button", ButtonAttributes> {}

interface ButtonAttributes extends DisableableAttributes {
  expanded?: boolean;
}

export function snapshotButton(
  element: SnapshotTargetElement,
): ButtonSnapshot | null {
  return {
    role: "button",
    name: resolveAccessibleName(element),
    attributes: {
      ...disableableAttributes(element),
      expanded: booleanAttribute(element.ariaExpanded),
    },
    children: snapshotChildren(element),
  };
}
