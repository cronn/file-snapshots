import { booleanAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ButtonSnapshot
  extends GenericElementSnapshot<"button", ButtonAttributes> {}

interface ButtonAttributes {
  disabled?: boolean;
  expanded?: boolean;
}

export function snapshotButton(
  element: SnapshotTargetElement,
): ButtonSnapshot | null {
  return {
    role: "button",
    name: resolveAccessibleName(element),
    attributes: {
      disabled: booleanAttribute(element.hasAttribute("disabled")),
      expanded: booleanAttribute(element.ariaExpanded),
    },
    children: snapshotChildren(element),
  };
}
