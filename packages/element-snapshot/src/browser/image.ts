import type { ImageSnapshot } from "../types/elements/image";
import { elementSnapshot } from "../utils/factories";

import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

export function snapshotImage(
  element: SnapshotTargetElement,
): ImageSnapshot | null {
  const imageName = resolveAccessibleName(element);

  if (imageName === undefined) {
    return null;
  }

  return elementSnapshot({
    role: "img",
    name: imageName,
  });
}
