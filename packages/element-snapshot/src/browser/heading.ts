import type { HeadingSnapshot } from "../types/elements/heading";

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
  return Number(element.localName.slice(1));
}
