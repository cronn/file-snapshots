import type { HeadingSnapshot } from "../types/elements/heading";

import { integerAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

/** Implicit `aria-level` of the `heading` role */
const DEFAULT_LEVEL = 2;

export function snapshotHeading(
  element: SnapshotTargetElement,
): HeadingSnapshot {
  return {
    role: "heading",
    name: resolveAccessibleName(element),
    attributes: {
      level: resolveLevel(element),
    },
    children: snapshotChildren(element),
  };
}

function resolveLevel(element: SnapshotTargetElement): number {
  const ariaLevel = integerAttribute(element.ariaLevel);
  if (ariaLevel !== undefined && ariaLevel >= 1) {
    return ariaLevel;
  }

  if (element instanceof HTMLHeadingElement) {
    return Number(element.localName.slice(1));
  }

  return DEFAULT_LEVEL;
}
