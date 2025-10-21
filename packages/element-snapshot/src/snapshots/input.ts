import { booleanAttribute, stringAttribute } from "./attribute";
import { resolveDescription } from "./description";
import { resolveAccessibleName } from "./name";
import { resolveInputRole } from "./role";
import type { DisableableAttributes } from "./state";
import { disableableAttributes } from "./state";
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

interface InputAttributes extends CommonInputAttributes {
  value?: string;
  checked?: boolean;
}

export interface CommonInputAttributes extends DisableableAttributes {
  description?: string;
  placeholder?: string;
  readonly?: boolean;
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

  const value = resolveInputValue(element);

  return {
    role: inputRole,
    name: resolveInputLabel(element),
    attributes: {
      value,
      checked: resolveChecked(element),
      ...snapshotCommonInputAttributes(element, value === undefined),
    },
  };
}

function snapshotTextareaElement(element: HTMLTextAreaElement): InputSnapshot {
  const value = resolveInputValue(element);

  return {
    role: "textbox",
    name: resolveInputLabel(element),
    attributes: {
      value,
      ...snapshotCommonInputAttributes(element, value === undefined),
    },
  };
}

export function snapshotCommonInputAttributes(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  isEmpty: boolean,
): CommonInputAttributes {
  return {
    description: resolveDescription(element),
    placeholder: isEmpty ? resolvePlaceholder(element) : undefined,
    readonly: booleanAttribute(element.hasAttribute("readonly")),
    ...disableableAttributes(element),
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
  const accessibleName = resolveAccessibleName(element, false);
  if (accessibleName !== undefined) {
    return accessibleName;
  }

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

  return undefined;
}

function resolvePlaceholder(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string | undefined {
  if (element instanceof HTMLSelectElement) {
    return undefined;
  }

  return stringAttribute(element.placeholder);
}
