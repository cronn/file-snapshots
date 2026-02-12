import { snapshotNodeRecursive } from "./element";
import type { NodeSnapshot } from "./types";

export function snapshotChildren(
  node: Node,
  excludedNodes: Array<Node> = [],
): Array<NodeSnapshot> | undefined {
  const children = Array.from(node.childNodes)
    .map((node) => snapshotNodeRecursive(node, excludedNodes))
    .filter((childSnapshot) => childSnapshot !== null)
    .flat();
  return children.length > 0 ? children : undefined;
}
