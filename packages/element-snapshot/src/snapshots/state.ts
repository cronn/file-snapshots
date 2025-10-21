import { booleanAttribute } from "./attribute";
import type { SnapshotTargetElement } from "./types";

export interface DisableableAttributes {
  disabled?: boolean;
}

export function disableableAttributes(
  element: SnapshotTargetElement,
): DisableableAttributes {
  return {
    disabled: booleanAttribute(element.hasAttribute("disabled")),
  };
}

export interface SelectableAttributes {
  selected?: boolean;
}

export function selectableAttributes(
  element: SnapshotTargetElement,
): SelectableAttributes {
  return { selected: booleanAttribute(element.ariaSelected) };
}
