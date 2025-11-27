import { booleanAttribute } from "./attribute";
import type { SnapshotTargetElement } from "./types";

export interface DisableableAttributes {
  disabled?: boolean;
}

export function disableableAttributes(
  element: SnapshotTargetElement,
  ariaOnly = false,
): DisableableAttributes {
  const ariaDisabled = booleanAttribute(element.ariaDisabled);
  if (ariaOnly) {
    return { disabled: ariaDisabled };
  }

  return {
    disabled:
      booleanAttribute(element.hasAttribute("disabled")) ?? ariaDisabled,
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
