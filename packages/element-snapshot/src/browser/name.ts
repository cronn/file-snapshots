import type { ElementRole } from "../types/role";

import { resolveElementReference, stringAttribute } from "./attribute";
import { parseElementRole } from "./role";
import { attributeSelector } from "./selector";
import { resolveAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

// See https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#accessiblenameguidancebyrole
const prohibitsNaming = new Set<ElementRole>([
  "label",
  "listitem",
  "paragraph",
  "rowgroup",
  "term",
]);

const supportsNamingByLabel = new Set<ElementRole>([
  "checkbox",
  "combobox",
  "progressbar",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "textbox",
]);

const supportsNamingFromChildContent = new Set<ElementRole>([
  "button",
  "cell",
  "columnheader",
  "gridcell",
  "heading",
  "link",
  "menuitem",
  "option",
  "rowheader",
  "tab",
]);

const contextBasedNameResolvers: Array<ContextBasedNameResolver> = [
  resolveImageName,
  resolveLegendName,
];

type ContextBasedNameResolver = (
  element: SnapshotTargetElement,
  role: ElementRole,
) => string | undefined;

// Inspired by https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#name_calculation
export function resolveAccessibleName(
  element: SnapshotTargetElement,
  role?: ElementRole,
): string | undefined {
  role = role ?? parseElementRole(element);

  if (role === undefined || prohibitsNaming.has(role)) {
    return undefined;
  }

  const labelledByElement = resolveElementReference(element, "aria-labelledby");
  if (labelledByElement !== null) {
    return resolveAccessibleTextContent(labelledByElement);
  }

  if (element.ariaLabel !== null) {
    return element.ariaLabel;
  }

  for (const resolveName of contextBasedNameResolvers) {
    const name = resolveName(element, role);
    if (name !== undefined) {
      return name;
    }
  }

  if (supportsNamingByLabel.has(role)) {
    return resolveLabelName(element);
  }

  if (supportsNamingFromChildContent.has(role)) {
    return resolveAccessibleTextContent(element);
  }

  return undefined;
}

function resolveLabelName(element: SnapshotTargetElement): string | undefined {
  if (element.id !== null) {
    const referencedElement = element.ownerDocument.querySelector(
      attributeSelector("for", element.id),
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

function resolveLegendName(element: SnapshotTargetElement): string | undefined {
  if (!(element instanceof HTMLFieldSetElement)) {
    return undefined;
  }

  const legendElement = element.querySelector("legend");
  if (legendElement === null) {
    return undefined;
  }

  return resolveAccessibleTextContent(legendElement);
}

function resolveImageName(
  element: SnapshotTargetElement,
  role: ElementRole,
): string | undefined {
  if (element instanceof HTMLImageElement) {
    return stringAttribute(element.alt);
  }

  if (role === "img") {
    return resolveAccessibleTextContent(element);
  }

  return undefined;
}
