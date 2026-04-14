import type { ComboboxSnapshot, OptionSnapshot } from "../types/elements/input";
import { filterByRole } from "../utils/filter";

import { resolveElementReference } from "./attribute";
import { snapshotChildren } from "./children";
import {
  resolveInputLabel,
  resolveInputValue,
  snapshotCommonInputAttributes,
} from "./input";
import { resolveAccessibleName } from "./name";
import { disableableAttributes, selectableAttributes } from "./state";
import { resolveAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

type ComboboxElement = HTMLSelectElement | HTMLInputElement | HTMLButtonElement;

export function snapshotCombobox(
  element: SnapshotTargetElement,
): ComboboxSnapshot | null {
  if (!isCombobox(element)) {
    return null;
  }

  const options = snapshotOptions(element);

  return {
    role: "combobox",
    name: resolveInputLabel(element),
    attributes: {
      value: resolveValue(element),
      ...snapshotCommonInputAttributes(element),
    },
    children: [],
    options,
  };
}

function isCombobox(
  element: SnapshotTargetElement,
): element is ComboboxElement {
  if (element instanceof HTMLSelectElement) {
    return element.role === null || element.role === "combobox";
  }

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLButtonElement
  ) {
    return element.role === "combobox";
  }

  return false;
}

function resolveValue(
  element: ComboboxElement,
): string | Array<string> | undefined {
  if (element instanceof HTMLButtonElement) {
    return resolveAccessibleTextContent(element);
  }

  if (element instanceof HTMLInputElement) {
    return resolveInputValue(element);
  }

  const selectedLabels = Array.from(element.selectedOptions).map(
    (option) => option.label,
  );

  if (selectedLabels.length === 0) {
    return undefined;
  }

  if (selectedLabels.length === 1) {
    return selectedLabels.at(0);
  }

  return selectedLabels;
}

function snapshotOptions(element: ComboboxElement): Array<OptionSnapshot> {
  const optionsContainer = resolveOptionsContainer(element);
  if (optionsContainer === null) {
    return [];
  }

  return filterByRole("option", snapshotChildren(optionsContainer));
}

function resolveOptionsContainer(element: ComboboxElement): HTMLElement | null {
  if (element instanceof HTMLSelectElement) {
    return element;
  }

  const controlledElement = resolveElementReference(element, "aria-controls");
  if (controlledElement === null) {
    return null;
  }

  return controlledElement;
}

export function snapshotOption(
  element: SnapshotTargetElement,
): OptionSnapshot | null {
  return {
    role: "option",
    name: resolveAccessibleName(element),
    attributes: {
      ...selectableAttributes(element),
      ...disableableAttributes(element),
    },
    children: snapshotChildren(element),
  };
}
