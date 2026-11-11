import type { ElementTagName, SnapshotTargetElement } from "./types";

export function getElementTagName(
  element: SnapshotTargetElement,
): ElementTagName {
  return element.localName as ElementTagName;
}

export function isWithinElement(
  element: Element,
  containerSelector: string,
): boolean {
  return element.closest(containerSelector) !== null;
}
