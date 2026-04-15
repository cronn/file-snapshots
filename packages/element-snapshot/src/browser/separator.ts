import type { SeparatorSnapshot } from "../types/elements/separator";
import { elementSnapshot } from "../utils/factories";

import { snapshotPresentationalChildren } from "./text";
import type { SnapshotTargetElement } from "./types";

export function snapshotSeparator(
  element: SnapshotTargetElement,
): SeparatorSnapshot {
  return elementSnapshot({
    role: "separator",
    children: snapshotPresentationalChildren(element),
  });
}
