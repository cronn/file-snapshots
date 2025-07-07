import { snapshotTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function resolveAccessibleName(
  element: SnapshotTargetElement,
  includeTextContent = false,
): string | undefined {
  if (element.ariaLabel !== null) {
    return element.ariaLabel;
  }

  const ariaLabelledBy = element.getAttribute("aria-labelledby");
  if (ariaLabelledBy !== null) {
    const referencedElement =
      element.ownerDocument.getElementById(ariaLabelledBy);
    if (referencedElement !== null) {
      return snapshotTextContent(referencedElement);
    }
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

  if (includeTextContent) {
    return snapshotTextContent(element);
  }

  return undefined;
}
