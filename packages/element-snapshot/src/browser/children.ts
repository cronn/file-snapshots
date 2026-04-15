import type { NodeSnapshot } from "../types/snapshot";
import { textSnapshot } from "../utils/factories";
import { isTextSnapshot } from "../utils/guards";
import { mergeTexts } from "../utils/text";

import { snapshotNodeRecursive } from "./element";

export function snapshotChildren(
  node: Node,
  excludedNodes: Array<Node> = [],
): Array<NodeSnapshot> {
  const children = Array.from(node.childNodes)
    .map((childNode) => snapshotNodeRecursive(childNode, excludedNodes))
    .filter((childSnapshot) => childSnapshot !== null)
    .flat();

  return mergeConsecutiveTexts(children);
}

function mergeConsecutiveTexts(
  children: Array<NodeSnapshot>,
): Array<NodeSnapshot> {
  return children.reduce<Array<NodeSnapshot>>((mergedChildren, child) => {
    const lastMergedChildIndex = mergedChildren.length - 1;
    const lastMergedChild = mergedChildren[lastMergedChildIndex];

    if (
      lastMergedChild !== undefined &&
      isTextSnapshot(lastMergedChild) &&
      isTextSnapshot(child)
    ) {
      mergedChildren[lastMergedChildIndex] = textSnapshot(
        mergeTexts([lastMergedChild, child]),
      );
    } else {
      mergedChildren.push(child);
    }

    return mergedChildren;
  }, []);
}
