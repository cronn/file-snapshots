import { snapshotChildren } from "./children";
import type { InputStateAttributes } from "./input";
import { resolveInputLabel, snapshotInputStateAttributes } from "./input";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ComboboxSnapshot
  extends GenericElementSnapshot<"combobox", ComboboxAttributes> {
  options?: Array<OptionSnapshot>;
}

interface ComboboxAttributes extends InputStateAttributes {
  value?: string | Array<string>;
}

export function snapshotCombobox(
  element: SnapshotTargetElement,
): ComboboxSnapshot | null {
  if (!(element instanceof HTMLSelectElement)) {
    return null;
  }

  return {
    role: "combobox",
    name: resolveInputLabel(element),
    attributes: {
      value: resolveValue(element),
      ...snapshotInputStateAttributes(element),
    },
    options: resolveOptions(element),
  };
}

function resolveValue(
  element: HTMLSelectElement,
): string | Array<string> | undefined {
  const selectedOptions = Array.from(element.options)
    .filter((option) => option.selected)
    .map((option) => resolveAccessibleName(option))
    .filter((optionName) => optionName !== undefined);

  if (selectedOptions.length === 0) {
    return undefined;
  }

  if (selectedOptions.length === 1) {
    return selectedOptions.at(0);
  }

  return selectedOptions;
}

function resolveOptions(element: HTMLSelectElement): Array<OptionSnapshot> {
  return Array.from(element.options)
    .map(snapshotOption)
    .filter((childSnapshot) => childSnapshot !== null);
}

export interface OptionSnapshot
  extends GenericElementSnapshot<"option", OptionAttributes> {}

interface OptionAttributes {
  selected?: boolean;
}

export function snapshotOption(
  element: SnapshotTargetElement,
): OptionSnapshot | null {
  if (!(element instanceof HTMLOptionElement)) {
    return null;
  }

  return {
    role: "option",
    name: resolveAccessibleName(element),
    attributes: {
      selected: element.selected ? true : undefined,
    },
    children: snapshotChildren(element),
  };
}
