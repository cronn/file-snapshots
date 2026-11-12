import type { SnapshotTargetNode } from "./types";

// the content of a closed <details> element is not rendered, except for its summary (the first <summary> child)
export function isCollapsedDetailsContent(node: SnapshotTargetNode): boolean {
  const parentElement = node.parentElement;
  return (
    parentElement instanceof HTMLDetailsElement &&
    !parentElement.open &&
    parentElement.querySelector(":scope > summary") !== node
  );
}
