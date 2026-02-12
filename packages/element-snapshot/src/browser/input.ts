import { stringAttribute } from "./attribute";
import type { DiscribableAttributes } from "./description";
import { discribableAttributes } from "./description";
import { resolveAccessibleName } from "./name";
import { resolveInputRole } from "./role";
import type { InputStateAttributes } from "./state";
import { inputStateAttributes } from "./state";
import { resolveAccessibleTextContent } from "./text";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface InputSnapshot extends GenericElementSnapshot<
  CommonInputRole,
  InputAttributes
> {}

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

export interface CommonInputAttributes
  extends InputStateAttributes, DiscribableAttributes {
  placeholder?: string;
}

type InputElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLButtonElement;

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
  element: InputElement,
  isEmpty: boolean,
): CommonInputAttributes {
  return {
    ...discribableAttributes(element),
    placeholder: isEmpty ? resolvePlaceholder(element) : undefined,
    ...inputStateAttributes(element),
  };
}

const CHECKED_INPUT_TYPES = new Set(["checkbox", "radio"]);

export function resolveInputValue(
  element: HTMLInputElement | HTMLTextAreaElement,
): string | undefined {
  if (
    element instanceof HTMLInputElement &&
    CHECKED_INPUT_TYPES.has(element.type)
  ) {
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
      return resolveAccessibleTextContent(referencedElement);
    }
  }

  const closestLabel = element.closest("label");
  if (closestLabel !== null) {
    return resolveAccessibleTextContent(closestLabel, [element]);
  }

  return undefined;
}

function resolvePlaceholder(element: InputElement): string | undefined {
  if (
    element instanceof HTMLSelectElement ||
    element instanceof HTMLButtonElement
  ) {
    return undefined;
  }

  return stringAttribute(element.placeholder);
}
