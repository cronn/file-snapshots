import type { LinkAttributes, LinkSnapshot } from "../types/elements/link";

import { booleanOrEnumAttribute, stringAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

const currentValues = new Set(["page", "step"] as const);

export function snapshotLink(element: SnapshotTargetElement): LinkSnapshot {
  return {
    role: "link",
    name: resolveAccessibleName(element),
    attributes: linkAttributes(element),
    children: snapshotChildren(element),
  };
}

export function linkAttributes(element: SnapshotTargetElement): LinkAttributes {
  return {
    url: stringAttribute(element.getAttribute("href")),
    current: booleanOrEnumAttribute(element.ariaCurrent, currentValues),
  };
}
