import { stringAttribute } from "./attribute";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ImageSnapshot extends GenericElementSnapshot<"img"> {}

export function snapshotImage(
  element: SnapshotTargetElement,
): ImageSnapshot | null {
  const imageName = resolveImageName(element);

  if (imageName === undefined) {
    return null;
  }

  return {
    role: "img",
    name: imageName,
  };
}

function resolveImageName(element: SnapshotTargetElement): string | undefined {
  if (element instanceof HTMLImageElement) {
    return stringAttribute(element.alt);
  }

  return resolveAccessibleName(element, true);
}
