import { filterSnapshots } from "../utils/snapshot";

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
): Array<TextSnapshot> | undefined {
  const accessibleTextContent = resolveAccessibleTextContent(node);
  if (
    accessibleTextContent === undefined ||
    accessibleTextContent.length === 0
  ) {
    return undefined;
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

  const textNodes = filterSnapshots({
    snapshots: children,
    filter: (element) => element.role === "text",
  });

  const aggregatedText = textNodes.map((textNode) => textNode.name).join(" ");
  const normalizedText = normalizeText(aggregatedText);
  return normalizedText.length > 0 ? normalizedText : undefined;
}

function normalizeText(text: string): string {
  return text.replaceAll(/\s+/g, " ").trim();
}
