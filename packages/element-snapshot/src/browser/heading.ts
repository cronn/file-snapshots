import type { HeadingSnapshot } from "../types/elements/heading";

import { numericAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

const LEVEL_REGEXP = /^H([1-6])$/;

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

function resolveLevel(element: HTMLHeadingElement): number | undefined {
  const levelAsString = LEVEL_REGEXP.exec(element.nodeName)?.at(1) ?? null;
  return numericAttribute(levelAsString);
}
