import { snapshotNodeRecursive } from "./element";
import type { NodeSnapshot } from "./types";

export function snapshotChildren(
  node: Node,
  excludedNodes: Array<Node> = [],
): Array<NodeSnapshot> {
  const children = Array.from(node.childNodes)
    .map((childNode) => snapshotNodeRecursive(childNode, excludedNodes))
    .filter((childSnapshot) => childSnapshot !== null)
    .flat();
  return children;
}
