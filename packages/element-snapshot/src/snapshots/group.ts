import { snapshotChildren } from "./children";
import type { DiscribableAttributes } from "./description";
import { discribableAttributes } from "./description";
import { resolveAccessibleName } from "./name";
import { snapshotTextContent } from "./text";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface GroupSnapshot extends GenericElementSnapshot<"group"> {}

export function snapshotGroup(
  element: SnapshotTargetElement,
): GroupSnapshot | null {
  return {
    role: "group",
    name: resolveGroupName(element),
    children: snapshotChildren(element),
  };
}

function resolveGroupName(element: SnapshotTargetElement): string | undefined {
  const legendElement =
    element instanceof HTMLFieldSetElement
      ? element.querySelector("legend")
      : null;
  if (legendElement !== null) {
    return snapshotTextContent(legendElement);
  }

  return resolveAccessibleName(element, false);
}

export interface RadiogroupSnapshot
  extends GenericElementSnapshot<"radiogroup", RadiogroupAttributes> {}

interface RadiogroupAttributes extends DiscribableAttributes {}

export function snapshotRadiogroup(
  element: SnapshotTargetElement,
): RadiogroupSnapshot {
  return {
    role: "radiogroup",
    name: resolveAccessibleName(element, false),
    attributes: discribableAttributes(element),
    children: snapshotChildren(element),
  };
}
