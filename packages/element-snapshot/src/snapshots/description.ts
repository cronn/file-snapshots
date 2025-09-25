import { resolveElementReference } from "./attribute";
import { snapshotTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function resolveDescription(
  element: SnapshotTargetElement,
): string | undefined {
  const describedByElement = resolveElementReference(
    element,
    "aria-describedby",
  );
  if (describedByElement !== null) {
    return snapshotTextContent(describedByElement);
  }

  if (element.ariaDescription !== null) {
    return element.ariaDescription;
  }

  return undefined;
}
