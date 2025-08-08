import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ButtonSnapshot extends GenericElementSnapshot<"button"> {}

export function snapshotButton(
  element: SnapshotTargetElement,
): ButtonSnapshot | null {
  return {
    role: "button",
    name: resolveAccessibleName(element),
    children: snapshotChildren(element),
  };
}
