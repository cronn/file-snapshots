import type {
  CheckableAttributes,
  DisableableAttributes,
  ExpandableAttributes,
  InputStateAttributes,
  MultiselectableAttributes,
  SelectableAttributes,
} from "../types/attributes";

import { booleanAttribute, booleanOrEnumAttribute } from "./attribute";
import type { SnapshotTargetElement } from "./types";

export function disableableAttributes(
  element: SnapshotTargetElement,
): DisableableAttributes {
  return {
    disabled:
      booleanAttribute(element.matches(":disabled")) ??
      booleanAttribute(element.ariaDisabled),
  };
}

export function selectableAttributes(
  element: SnapshotTargetElement,
): SelectableAttributes {
  if (element instanceof HTMLOptionElement) {
    return { selected: booleanAttribute(element.selected) };
  }

  return { selected: booleanAttribute(element.ariaSelected) };
}

export function multiselectableAttributes(
  element: SnapshotTargetElement,
): MultiselectableAttributes {
  if (element instanceof HTMLSelectElement) {
    return { multiselectable: booleanAttribute(element.multiple) };
  }

  return { multiselectable: booleanAttribute(element.ariaMultiSelectable) };
}

export function expandableAttributes(
  element: SnapshotTargetElement,
): ExpandableAttributes {
  return {
    expanded: booleanAttribute(element.ariaExpanded),
  };
}

const checkedValues = new Set(["mixed"] as const);

export function checkableAttributes(
  element: SnapshotTargetElement,
): CheckableAttributes {
  return {
    checked: booleanOrEnumAttribute(element.ariaChecked, checkedValues),
  };
}

export function inputStateAttributes(
  element: SnapshotTargetElement,
): InputStateAttributes {
  return {
    readonly:
      booleanAttribute(isReadonly(element)) ??
      booleanAttribute(element.ariaReadOnly),
    ...disableableAttributes(element),
    required:
      booleanAttribute(element.matches(":required")) ??
      booleanAttribute(element.ariaRequired),
    invalid: booleanAttribute(element.ariaInvalid),
  };
}

/**
 * Input types supporting the `readonly` attribute
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly#attribute_interactions
 */
const READONLY_INPUT_TYPES = new Set([
  "text",
  "search",
  "url",
  "tel",
  "email",
  "password",
  "date",
  "month",
  "week",
  "time",
  "datetime-local",
  "number",
]);

function isReadonly(element: SnapshotTargetElement): boolean {
  if (element instanceof HTMLTextAreaElement) {
    return element.readOnly;
  }

  if (element instanceof HTMLInputElement) {
    return READONLY_INPUT_TYPES.has(element.type) && element.readOnly;
  }

  return false;
}
