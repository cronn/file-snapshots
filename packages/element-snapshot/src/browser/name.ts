import type { ElementRole } from "../types/role";

import { resolveElementReference, stringAttribute } from "./attribute";
import { parseElementRole } from "./role";
import { roleSelector } from "./selector";
import { resolveAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

// See https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#accessiblenameguidancebyrole
const prohibitsNaming = new Set<ElementRole>([
  "code",
  "emphasis",
  "label",
  "listitem",
  "paragraph",
  "rowgroup",
  "strong",
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
  resolveTreeItemName,
];

type ContextBasedNameResolver = (
  element: SnapshotTargetElement,
  role: ElementRole,
) => string | undefined;

// Inspired by https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#name_calculation
export function resolveAccessibleName(
  element: SnapshotTargetElement,
): string | undefined {
  const role = parseElementRole(element);

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

// Uses the label association computed by the browser, see
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/labels
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control
function resolveLabelName(element: SnapshotTargetElement): string | undefined {
  const labels = resolveLabels(element);
  if (labels === null) {
    return undefined;
  }

  const labelNames = Array.from(labels)
    .map((label) => resolveAccessibleTextContent(label, [element]))
    .filter((name) => name !== undefined);

  return labelNames.length > 0 ? labelNames.join(" ") : undefined;
}

function resolveLabels(
  element: SnapshotTargetElement,
): NodeListOf<HTMLLabelElement> | null {
  if (!("labels" in element)) {
    return null;
  }

  const labels: unknown = element.labels;
  return labels instanceof NodeList
    ? (labels as NodeListOf<HTMLLabelElement>)
    : null;
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

function resolveTreeItemName(
  element: SnapshotTargetElement,
  role: ElementRole,
): string | undefined {
  if (role !== "treeitem") {
    return undefined;
  }

  return resolveAccessibleTextContent(
    element,
    Array.from(element.querySelectorAll(roleSelector("group"))),
  );
}
