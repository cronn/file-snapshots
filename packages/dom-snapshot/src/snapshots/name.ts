import { resolveElementReference } from "./attribute";
import { snapshotTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function resolveAccessibleName(
  element: SnapshotTargetElement,
  includeTextContent = true,
): string | undefined {
  if (element.ariaLabel !== null) {
    return element.ariaLabel;
  }

  const labelledByElement = resolveElementReference(element, "aria-labelledby");
  if (labelledByElement !== null) {
    return snapshotTextContent(labelledByElement);
  }

  if (includeTextContent) {
    return snapshotTextContent(element);
  }

  return undefined;
}
