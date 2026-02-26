import { booleanAttribute, resolveElementReference } from "./attribute";
import { snapshotChildren } from "./children";
import type { CommonInputAttributes } from "./input";
import {
  resolveInputLabel,
  resolveInputValue,
  snapshotCommonInputAttributes,
} from "./input";
import { resolveAccessibleName } from "./name";
import { roleSelector, selectorList } from "./selector";
import { resolveAccessibleTextContent } from "./text";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ComboboxSnapshot extends GenericElementSnapshot<
  "combobox",
  ComboboxAttributes
> {
  options: Array<OptionSnapshot>;
}

interface ComboboxAttributes extends CommonInputAttributes {
  value?: string | Array<string>;
}

type ComboboxElement = HTMLSelectElement | HTMLInputElement | HTMLButtonElement;

export function snapshotCombobox(
  element: SnapshotTargetElement,
): ComboboxSnapshot | null {
  if (!isCombobox(element)) {
    return null;
  }

  const options = snapshotOptions(element);
  const value = resolveValue(element);

  return {
    role: "combobox",
    name: resolveInputLabel(element),
    attributes: {
      value,
      ...snapshotCommonInputAttributes(element, value === undefined),
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
  return resolveOptions(element)
    .map(snapshotOption)
    .filter((childSnapshot) => childSnapshot !== null);
}

function resolveOptions(element: ComboboxElement): Array<HTMLElement> {
  if (element instanceof HTMLSelectElement) {
    return Array.from(element.options);
  }

  const controlledElement = resolveElementReference(element, "aria-controls");
  if (controlledElement === null) {
    return [];
  }

  const optionSelector = selectorList("option", roleSelector("option"));
  return Array.from(controlledElement.querySelectorAll(optionSelector));
}

export interface OptionSnapshot extends GenericElementSnapshot<
  "option",
  OptionAttributes
> {}

interface OptionAttributes {
  selected?: boolean;
}

export function snapshotOption(
  element: SnapshotTargetElement,
): OptionSnapshot | null {
  return {
    role: "option",
    name: resolveAccessibleName(element),
    attributes: {
      selected:
        element instanceof HTMLOptionElement
          ? booleanAttribute(element.selected)
          : booleanAttribute(element.ariaSelected),
    },
    children: snapshotChildren(element),
  };
}
