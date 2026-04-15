import type { TextSnapshot } from "../types/elements/text";
import type { NodeSnapshot } from "../types/snapshot";

import { filter } from "./filter";
import { isTextSnapshot } from "./guards";

/**
 * Aggregates and normalizes the text content of all provided snapshots
 */
export function getTextContent(snapshots: Array<NodeSnapshot>): string {
  const texts = filter({
    snapshots,
    predicate: isTextSnapshot,
  });

  return mergeTexts(texts);
}

export function normalizeText(text: string): string {
  return text.replaceAll(/\s+/g, " ").trim();
}

export function mergeTexts(texts: Array<TextSnapshot>): string {
  const mergedText = texts.map((textNode) => textNode.name).join(" ");
  return normalizeText(mergedText);
}
