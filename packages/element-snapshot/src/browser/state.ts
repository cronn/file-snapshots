import type {
  DisableableAttributes,
  InputStateAttributes,
  SelectableAttributes,
} from "../types/attributes";

import { booleanAttribute } from "./attribute";
import type { SnapshotTargetElement } from "./types";

export function disableableAttributes(
  element: SnapshotTargetElement,
): DisableableAttributes {
  const supportsHtmlAttribute =
    isNativeInputElement(element) || element instanceof HTMLButtonElement;
  const disabled = booleanAttribute(
    supportsHtmlAttribute ? element.hasAttribute("disabled") : false,
  );

  return {
    disabled: disabled ?? booleanAttribute(element.ariaDisabled),
  };
}

export function selectableAttributes(
  element: SnapshotTargetElement,
): SelectableAttributes {
  return { selected: booleanAttribute(element.ariaSelected) };
}

export function inputStateAttributes(
  element: SnapshotTargetElement,
): InputStateAttributes {
  const supportsHtmlAttributes = isNativeInputElement(element);
  const readonly = booleanAttribute(
    supportsHtmlAttributes ? element.hasAttribute("readonly") : false,
  );
  const required = booleanAttribute(
    supportsHtmlAttributes ? element.hasAttribute("required") : false,
  );

  return {
    readonly: readonly ?? booleanAttribute(element.ariaReadOnly),
    ...disableableAttributes(element),
    required: required ?? booleanAttribute(element.ariaRequired),
    invalid: booleanAttribute(element.ariaInvalid),
  };
}

function isNativeInputElement(element: SnapshotTargetElement): boolean {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}
