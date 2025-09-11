import { booleanAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ButtonSnapshot
  extends GenericElementSnapshot<"button", ButtonAttributes> {}

interface ButtonAttributes {
  disabled?: boolean;
}

export function snapshotButton(
  element: SnapshotTargetElement,
): ButtonSnapshot | null {
  const disabledValue = element.getAttribute("disabled");

  return {
    role: "button",
    name: resolveAccessibleName(element),
    attributes: {
      disabled: booleanAttribute(disabledValue !== null),
    },
    children: snapshotChildren(element),
  };
}
