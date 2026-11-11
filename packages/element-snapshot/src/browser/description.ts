import type { DiscribableAttributes } from "../types/attributes";

import { resolveJoinedAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function discribableAttributes(
  element: SnapshotTargetElement,
): DiscribableAttributes {
  return {
    description: resolveDescription(element),
  };
}

function resolveDescription(
  element: SnapshotTargetElement,
): string | undefined {
  // See https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaDescribedByElements
  const describedByElements = element.ariaDescribedByElements ?? [];
  if (describedByElements.length > 0) {
    return resolveJoinedAccessibleTextContent(describedByElements);
  }

  if (element.ariaDescription !== null) {
    return element.ariaDescription;
  }

  return undefined;
}
