import type {
  CommonInputAttributes,
  InputSnapshot,
} from "../types/elements/input";
import { elementSnapshot } from "../utils/factories";

import { stringAttribute } from "./attribute";
import { discribableAttributes } from "./description";
import { resolveAccessibleName } from "./name";
import { resolveInputRole } from "./role";
import { inputStateAttributes } from "./state";
import type { SnapshotTargetElement } from "./types";

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

  return elementSnapshot({
    role: inputRole,
    name: resolveAccessibleName(element),
    attributes: {
      value: resolveInputValue(element),
      checked: resolveChecked(element),
      ...snapshotCommonInputAttributes(element),
    },
  });
}

function snapshotTextareaElement(element: HTMLTextAreaElement): InputSnapshot {
  return elementSnapshot({
    role: "textbox",
    name: resolveAccessibleName(element),
    attributes: {
      value: resolveInputValue(element),
      ...snapshotCommonInputAttributes(element),
    },
  });
}

export function snapshotCommonInputAttributes(
  element: InputElement,
): CommonInputAttributes {
  return {
    ...discribableAttributes(element),
    placeholder: resolvePlaceholder(element),
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

function resolvePlaceholder(element: InputElement): string | undefined {
  if (
    element instanceof HTMLSelectElement ||
    element instanceof HTMLButtonElement
  ) {
    return undefined;
  }

  return stringAttribute(element.placeholder);
}
