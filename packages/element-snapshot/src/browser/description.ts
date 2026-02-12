import { resolveElementReference } from "./attribute";
import { resolveAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export interface DiscribableAttributes {
  description?: string;
}

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
  const describedByElement = resolveElementReference(
    element,
    "aria-describedby",
  );
  if (describedByElement !== null) {
    return resolveAccessibleTextContent(describedByElement);
  }

  if (element.ariaDescription !== null) {
    return element.ariaDescription;
  }

  return undefined;
}
