import type {
  GroupSnapshot,
  RadioGroupSnapshot,
} from "../types/elements/group";
import { elementSnapshot } from "../utils/factories";

import { snapshotChildren } from "./children";
import { discribableAttributes } from "./description";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

export function snapshotGroup(
  element: SnapshotTargetElement,
): GroupSnapshot | null {
  return elementSnapshot({
    role: "group",
    name: resolveAccessibleName(element),
    children: snapshotChildren(element),
  });
}

export function snapshotRadioGroup(
  element: SnapshotTargetElement,
): RadioGroupSnapshot {
  return {
    role: "radiogroup",
    name: resolveAccessibleName(element),
    attributes: discribableAttributes(element),
    children: snapshotChildren(element),
  };
}
