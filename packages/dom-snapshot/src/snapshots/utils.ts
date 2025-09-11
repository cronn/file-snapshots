import type { ElementTagName, SnapshotTargetElement } from "./types";

export function getElementTagName(
  element: SnapshotTargetElement,
): ElementTagName {
  return element.tagName.toLowerCase() as ElementTagName;
}
