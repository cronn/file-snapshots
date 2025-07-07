import { stringAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface LinkSnapshot
  extends GenericElementSnapshot<"link", LinkAttributes> {}

interface LinkAttributes {
  url?: string;
}

export function snapshotLink(element: SnapshotTargetElement): LinkSnapshot {
  return {
    role: "link",
    name: resolveAccessibleName(element, true),
    attributes: { url: stringAttribute(element.getAttribute("href")) },
    children: snapshotChildren(element),
  };
}
