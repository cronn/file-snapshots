import type { RegionSnapshot } from "../types/elements/container";
import type { NodeSnapshot } from "../types/snapshot";
import { elementSnapshot } from "../utils/factories";

import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

export function snapshotRegion(
  element: SnapshotTargetElement,
): RegionSnapshot | Array<NodeSnapshot> {
  const name = resolveAccessibleName(element);
  const children = snapshotChildren(element);

  if (name === undefined) {
    return children;
  }

  return elementSnapshot({
    role: "region",
    name,
    children,
  });
}
