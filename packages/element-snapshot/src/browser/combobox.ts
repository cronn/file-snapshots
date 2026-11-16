import type { ComboboxSnapshot, OptionSnapshot } from "../types/elements/input";
import { unwrapSingleItem } from "../utils/array";
import { filterByRole } from "../utils/filter";
import { normalizeText } from "../utils/text";

import { stringAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveInputValue, snapshotCommonInputAttributes } from "./input";
import { resolveAccessibleName } from "./name";
import { resolveInputRole } from "./role";
import {
  disableableAttributes,
  expandableAttributes,
  selectableAttributes,
} from "./state";
import { resolveAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function snapshotCombobox(
  element: SnapshotTargetElement,
): ComboboxSnapshot | null {
  if (!isCombobox(element)) {
    return null;
  }

  const options = snapshotOptions(element);

  return {
    role: "combobox",
    name: resolveAccessibleName(element),
    attributes: {
      value: resolveValue(element),
      ...snapshotCommonInputAttributes(element),
      ...expandableAttributes(element),
      options,
    },
    children: [],
  };
}

function isCombobox(element: SnapshotTargetElement): boolean {
  // a <select> without an explicit role has the implicit role "combobox"
  if (element instanceof HTMLSelectElement) {
    return element.role === null || element.role === "combobox";
  }

  // an <input> with an associated <datalist> without an explicit role has the implicit role "combobox"
  if (element instanceof HTMLInputElement && element.role === null) {
    return resolveInputRole(element) === "combobox";
  }

  return element.role === "combobox";
}

function resolveValue(
  element: SnapshotTargetElement,
): string | Array<string> | undefined {
  if (element instanceof HTMLInputElement) {
    return resolveInputValue(element);
  }

  if (!(element instanceof HTMLSelectElement)) {
    return resolveAccessibleTextContent(element);
  }

  const selectedLabels = Array.from(element.selectedOptions).map(
    (option) => option.label,
  );

  if (selectedLabels.length === 0) {
    return undefined;
  }

  return unwrapSingleItem(selectedLabels);
}

function snapshotOptions(
  element: SnapshotTargetElement,
): Array<OptionSnapshot> {
  return resolveOptionsContainers(element).flatMap((optionsContainer) =>
    filterByRole("option", snapshotChildren(optionsContainer)),
  );
}

function resolveOptionsContainers(
  element: SnapshotTargetElement,
): ReadonlyArray<Element> {
  if (element instanceof HTMLSelectElement) {
    return [element];
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaControlsElements
  const controlledElements = element.ariaControlsElements ?? [];
  if (controlledElements.length > 0) {
    return controlledElements;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/list
  if (element instanceof HTMLInputElement && element.list !== null) {
    return [element.list];
  }

  return [];
}

export function snapshotOption(
  element: SnapshotTargetElement,
): OptionSnapshot | null {
  return {
    role: "option",
    name: resolveOptionName(element),
    attributes: {
      ...selectableAttributes(element),
      ...disableableAttributes(element),
    },
    children: snapshotChildren(element),
  };
}

function resolveOptionName(element: SnapshotTargetElement): string | undefined {
  const accessibleName = resolveAccessibleName(element);
  if (accessibleName !== undefined) {
    return accessibleName;
  }

  // browsers display the value of a <datalist> option without label or text content
  if (
    element instanceof HTMLOptionElement &&
    element.parentElement instanceof HTMLDataListElement
  ) {
    return stringAttribute(normalizeText(element.value));
  }

  return undefined;
}
