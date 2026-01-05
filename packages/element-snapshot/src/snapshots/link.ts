import { stringAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface LinkSnapshot extends GenericElementSnapshot<
  "link",
  LinkAttributes
> {}

export interface LinkAttributes {
  url?: string;
}

export function snapshotLink(element: SnapshotTargetElement): LinkSnapshot {
  return {
    role: "link",
    name: resolveAccessibleName(element),
    attributes: linkAttributes(element),
    children: snapshotChildren(element),
  };
}

export function linkAttributes(element: SnapshotTargetElement): LinkAttributes {
  return { url: stringAttribute(element.getAttribute("href")) };
}
