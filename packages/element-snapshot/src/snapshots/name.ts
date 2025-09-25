import { resolveElementReference } from "./attribute";
import { snapshotTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function resolveAccessibleName(
  element: SnapshotTargetElement,
  includeTextContent = true,
): string | undefined {
  const labelledByElement = resolveElementReference(element, "aria-labelledby");
  if (labelledByElement !== null) {
    return snapshotTextContent(labelledByElement);
  }

  if (element.ariaLabel !== null) {
    return element.ariaLabel;
  }

  if (includeTextContent) {
    return snapshotTextContent(element);
  }

  return undefined;
}
