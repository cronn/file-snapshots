import type { HeadingSnapshot } from "../types/elements/heading";

import { integerAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

export function snapshotHeading(
  element: SnapshotTargetElement,
): HeadingSnapshot | null {
  if (!(element instanceof HTMLHeadingElement)) {
    return null;
  }

  return {
    role: "heading",
    name: resolveAccessibleName(element),
    attributes: {
      level: resolveLevel(element),
    },
    children: snapshotChildren(element),
  };
}

function resolveLevel(element: HTMLHeadingElement): number {
  const ariaLevel = integerAttribute(element.ariaLevel);
  if (ariaLevel !== undefined && ariaLevel >= 1) {
    return ariaLevel;
  }

  return Number(element.localName.slice(1));
}
