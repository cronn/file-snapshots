import type { NodeSnapshot } from "../browser/types";

import { filter } from "./filter";
import { isTextSnapshot } from "./guards";

/**
 * Aggregates and normalizes the text content of all provided snapshots
 */
export function getTextContent(snapshots: Array<NodeSnapshot>): string {
  const textNodes = filter({
    snapshots,
    predicate: isTextSnapshot,
  });

  const aggregatedText = textNodes.map((textNode) => textNode.name).join(" ");
  return normalizeText(aggregatedText);
}

export function normalizeText(text: string): string {
  return text.replaceAll(/\s+/g, " ").trim();
}
