import { snapshotNodeRecursive } from "./element";
import type { NodeSnapshot, SnapshotTargetElement } from "./types";

export function snapshotChildren(
  element: SnapshotTargetElement,
): Array<NodeSnapshot> | undefined {
  const children = Array.from(element.childNodes)
    .map(snapshotNodeRecursive)
    .filter((childSnapshot) => childSnapshot !== null)
    .flat();
  return children.length > 0 ? children : undefined;
}
