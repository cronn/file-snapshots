import type { ImageSnapshot } from "../types/elements/image";

import { stringAttribute } from "./attribute";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

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
    attributes: {},
    children: [],
  };
}

function resolveImageName(element: SnapshotTargetElement): string | undefined {
  if (element instanceof HTMLImageElement) {
    return stringAttribute(element.alt);
  }

  return resolveAccessibleName(element, true);
}
