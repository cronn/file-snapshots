import { getTextContent, normalizeText } from "../utils/text";

import { snapshotChildren } from "./children";

export interface TextSnapshot {
  role: "text";
  name: string;
}

export function snapshotTextNode(textNode: Node): TextSnapshot | null {
  if (textNode.textContent === null) {
    return null;
  }

  const normalizedText = normalizeText(textNode.textContent);
  if (normalizedText.length === 0) {
    return null;
  }

  return {
    role: "text",
    name: normalizedText,
  };
}

export function snapshotPresentationalChildren(
  node: Node,
): Array<TextSnapshot> {
  const accessibleTextContent = resolveAccessibleTextContent(node);
  if (
    accessibleTextContent === undefined ||
    accessibleTextContent.length === 0
  ) {
    return [];
  }

  return [
    {
      role: "text",
      name: accessibleTextContent,
    },
  ];
}

export function resolveAccessibleTextContent(
  node: Node,
  excludedNodes: Array<Node> = [],
): string | undefined {
  const children = snapshotChildren(node, excludedNodes);
  if (children === undefined) {
    return undefined;
  }

  const textContent = getTextContent(children);
  return textContent.length > 0 ? textContent : undefined;
}
