import type { SeparatorSnapshot } from "../types/elements/separator";

import { snapshotPresentationalChildren } from "./text";
import type { SnapshotTargetElement } from "./types";

export function snapshotSeparator(
  element: SnapshotTargetElement,
): SeparatorSnapshot {
  return {
    role: "separator",
    attributes: {},
    children: snapshotPresentationalChildren(element),
  };
}
