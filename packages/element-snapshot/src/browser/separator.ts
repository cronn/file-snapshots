import { snapshotPresentationalChildren } from "./text";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface SeparatorSnapshot extends GenericElementSnapshot<"separator"> {}

export function snapshotSeparator(
  element: SnapshotTargetElement,
): SeparatorSnapshot {
  return {
    role: "separator",
    attributes: {},
    children: snapshotPresentationalChildren(element),
  };
}
