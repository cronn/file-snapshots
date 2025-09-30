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
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ComboboxSnapshot
  extends GenericElementSnapshot<"combobox", ComboboxAttributes> {
  options?: Array<OptionSnapshot>;
}

interface ComboboxAttributes extends CommonInputAttributes {
  value?: string | Array<string>;
}

type ComboboxElement = HTMLSelectElement | HTMLInputElement;

export function snapshotCombobox(
  element: SnapshotTargetElement,
): ComboboxSnapshot | null {
  if (!isCombobox(element)) {
    return null;
  }

  const options = snapshotOptions(element);
  const value = resolveValue(element, options);

  return {
    role: "combobox",
    name: resolveInputLabel(element),
    attributes: {
      value,
      ...snapshotCommonInputAttributes(element, value === undefined),
    },
    options,
  };
}

function isCombobox(
  element: SnapshotTargetElement,
): element is ComboboxElement {
  if (element instanceof HTMLSelectElement) {
    return element.role === null || element.role === "combobox";
  }

  if (element instanceof HTMLInputElement) {
    return element.role === "combobox";
  }

  return false;
}

function resolveValue(
  element: ComboboxElement,
  options: Array<OptionSnapshot>,
): string | Array<string> | undefined {
  const selectedOptions = options
    .filter((option) => option.attributes?.selected === true)
    .map((option) => option.name)
    .filter((optionName) => optionName !== undefined);

  if (selectedOptions.length === 0) {
    return element instanceof HTMLInputElement
      ? resolveInputValue(element)
      : undefined;
  }

  if (selectedOptions.length === 1) {
    return selectedOptions.at(0);
  }

  return selectedOptions;
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

  const ariaExpanded = element.ariaExpanded === "true";
  if (!ariaExpanded) {
    return [];
  }

  const controlledElement = resolveElementReference(element, "aria-controls");
  if (controlledElement === null) {
    return [];
  }

  const optionSelector = selectorList("option", roleSelector("option"));
  return Array.from(controlledElement.querySelectorAll(optionSelector));
}

export interface OptionSnapshot
  extends GenericElementSnapshot<"option", OptionAttributes> {}

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
