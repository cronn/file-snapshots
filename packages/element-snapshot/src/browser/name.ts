import { resolveElementReference } from "./attribute";
import { resolveAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function resolveAccessibleName(
  element: SnapshotTargetElement,
  includeTextContent = true,
): string | undefined {
  const labelledByElement = resolveElementReference(element, "aria-labelledby");
  if (labelledByElement !== null) {
    return resolveAccessibleTextContent(labelledByElement);
  }

  if (element.ariaLabel !== null) {
    return element.ariaLabel;
  }

  if (includeTextContent) {
    return resolveAccessibleTextContent(element);
  }

  return undefined;
}
