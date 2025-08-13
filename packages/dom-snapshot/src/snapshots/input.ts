import { booleanAttribute, stringAttribute } from "./attribute";
import { resolveAccessibleName } from "./name";
import { resolveInputRole } from "./role";
import { snapshotTextContent } from "./text";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface InputSnapshot
  extends GenericElementSnapshot<CommonInputRole, InputAttributes> {}

export type InputRole = "button" | "combobox" | CommonInputRole;

export type CommonInputRole =
  | "checkbox"
  | "radio"
  | "searchbox"
  | "slider"
  | "spinbutton"
  | "textbox";

interface InputAttributes extends InputStateAttributes {
  value?: string;
  checked?: boolean;
}

export interface InputStateAttributes {
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

  if (element instanceof HTMLTextAreaElement) {
    return snapshotTextareaElement(element);
  }

  return null;
}

function snapshotInputElement(element: HTMLInputElement): InputSnapshot | null {
  const inputRole = resolveInputRole(element);

  if (
    inputRole === undefined ||
    inputRole === "button" ||
    inputRole === "combobox"
  ) {
    return null;
  }

  return {
    role: inputRole,
    name: resolveInputLabel(element),
    attributes: {
      value: resolveInputValue(element),
      checked: resolveChecked(element),
      ...snapshotInputStateAttributes(element),
    },
  };
}

function snapshotTextareaElement(element: HTMLTextAreaElement): InputSnapshot {
  return {
    role: "textbox",
    name: resolveInputLabel(element),
    attributes: {
      value: resolveInputValue(element),
      ...snapshotInputStateAttributes(element),
    },
  };
}

export function snapshotInputStateAttributes(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): InputStateAttributes {
  const readonlyValue = element.getAttribute("readonly");

  return {
    readonly: booleanAttribute(
      readonlyValue === "" || readonlyValue === "readonly",
    ),
    disabled: booleanAttribute(element.disabled),
    required: booleanAttribute(element.required),
    invalid: booleanAttribute(element.ariaInvalid),
  };
}

export function resolveInputValue(
  element: HTMLInputElement | HTMLTextAreaElement,
): string | undefined {
  if (element instanceof HTMLInputElement && element.type === "checkbox") {
    return undefined;
  }

  return stringAttribute(element.value);
}

function resolveChecked(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): true | undefined {
  if (!(element instanceof HTMLInputElement)) {
    return undefined;
  }

  return element.checked ? true : undefined;
}

export function resolveInputLabel(
  element: SnapshotTargetElement,
): string | undefined {
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
