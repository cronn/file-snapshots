import type {
  GroupSnapshot,
  RadioGroupSnapshot,
} from "../types/elements/group";

import { snapshotChildren } from "./children";
import { discribableAttributes } from "./description";
import { resolveAccessibleName } from "./name";
import { resolveAccessibleTextContent } from "./text";
import type { SnapshotTargetElement } from "./types";

export function snapshotGroup(
  element: SnapshotTargetElement,
): GroupSnapshot | null {
  return {
    role: "group",
    name: resolveGroupName(element),
    attributes: {},
    children: snapshotChildren(element),
  };
}

function resolveGroupName(element: SnapshotTargetElement): string | undefined {
  const legendElement =
    element instanceof HTMLFieldSetElement
      ? element.querySelector("legend")
      : null;
  if (legendElement !== null) {
    return resolveAccessibleTextContent(legendElement);
  }

  return resolveAccessibleName(element, false);
}

export function snapshotRadioGroup(
  element: SnapshotTargetElement,
): RadioGroupSnapshot {
  return {
    role: "radiogroup",
    name: resolveAccessibleName(element, false),
    attributes: discribableAttributes(element),
    children: snapshotChildren(element),
  };
}
