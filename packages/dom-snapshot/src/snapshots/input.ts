import { booleanAttribute, stringAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import { resolveInputRole } from "./role";
import { snapshotTextContent } from "./text";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface InputSnapshot
  extends GenericElementSnapshot<CommonInputRole, InputAttributes> {}

export type InputRole = "button" | CommonInputRole;

export type CommonInputRole =
  | "checkbox"
  | "combobox"
  | "radio"
  | "searchbox"
  | "slider"
  | "spinbutton"
  | "textbox";

interface InputAttributes extends InputStateAttributes {
  value?: string;
  checked?: boolean;
}

interface InputStateAttributes {
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}

export function snapshotInput(
  element: SnapshotTargetElement,
): InputSnapshot | null {
  if (element instanceof HTMLInputElement) {
    return snapshotInputElement(element);
  }

  if (element instanceof HTMLSelectElement) {
    return snapshotSelectElement(element);
  }

  if (element instanceof HTMLTextAreaElement) {
    return snapshotTextareaElement(element);
  }

  return null;
}

function snapshotInputElement(element: HTMLInputElement): InputSnapshot | null {
  const inputRole = resolveInputRole(element);

  if (inputRole === undefined || inputRole === "button") {
    return null;
  }

  return {
    role: inputRole,
    name: resolveInputLabel(element),
    attributes: {
      value: resolveValue(element),
      checked: resolveChecked(element),
      ...snapshotStateAttributes(element),
    },
    children: snapshotChildren(element),
  };
}

function snapshotSelectElement(element: HTMLSelectElement): InputSnapshot {
  return {
    role: "combobox",
    name: resolveInputLabel(element),
    attributes: {
      value: resolveSelectValue(element),
      ...snapshotStateAttributes(element),
    },
    children: snapshotChildren(element),
  };
}

function snapshotTextareaElement(element: HTMLTextAreaElement): InputSnapshot {
  return {
    role: "textbox",
    name: resolveInputLabel(element),
    attributes: {
      value: resolveValue(element),
      ...snapshotStateAttributes(element),
    },
  };
}

function snapshotStateAttributes(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
) {
  return {
    readonly: resolveBooleanAttribute(element, "readonly"),
    disabled: resolveBooleanAttribute(element, "disabled"),
    required: resolveBooleanAttribute(element, "required"),
    invalid: booleanAttribute(element.ariaInvalid),
  };
}

function resolveValue(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string | undefined {
  if (element instanceof HTMLInputElement && element.type === "checkbox") {
    return undefined;
  }

  return stringAttribute(element.value);
}

function resolveSelectValue(element: HTMLSelectElement): string | undefined {
  const selectedOption = element.querySelector(
    `option[value='${element.value}']`,
  );

  if (selectedOption === null) {
    return undefined;
  }

  return snapshotTextContent(selectedOption);
}

function resolveChecked(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): true | undefined {
  if (!(element instanceof HTMLInputElement)) {
    return undefined;
  }

  return element.checked ? true : undefined;
}

function resolveBooleanAttribute(
  element: SnapshotTargetElement,
  attributeNameAndValue: string,
): true | undefined {
  const attributeValue = element.getAttribute(attributeNameAndValue);
  return (
    booleanAttribute(attributeValue, "") ??
    booleanAttribute(attributeValue, attributeNameAndValue)
  );
}

function resolveInputLabel(element: SnapshotTargetElement): string | undefined {
  if (element.id !== null) {
    const referencedElement = element.ownerDocument.querySelector(
      `[for='${element.id}']`,
    );
    if (referencedElement !== null) {
      return snapshotTextContent(referencedElement);
    }
  }

  const closestLabel = element.closest("label");
  if (closestLabel !== null) {
    return snapshotTextContent(closestLabel);
  }

  return resolveAccessibleName(element, false);
}
