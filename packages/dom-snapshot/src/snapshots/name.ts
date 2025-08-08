import { snapshotTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function resolveAccessibleName(
  element: SnapshotTargetElement,
  includeTextContent = true,
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

  if (includeTextContent) {
    return snapshotTextContent(element);
  }

  return undefined;
}
