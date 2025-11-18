import { booleanAttribute } from "./attribute";
import type { SnapshotTargetElement } from "./types";

export interface DisableableAttributes {
  disabled?: boolean;
}

export function disableableAttributes(
  element: SnapshotTargetElement,
  ariaOnly = false,
): DisableableAttributes {
  if (ariaOnly) {
    return { disabled: booleanAttribute(element.ariaDisabled) };
  }

  return {
    disabled:
      booleanAttribute(element.hasAttribute("disabled")) ??
      booleanAttribute(element.ariaDisabled),
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
