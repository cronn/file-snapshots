import { booleanAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveDescription } from "./description";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface DialogSnapshot
  extends GenericElementSnapshot<"dialog", DialogAttributes> {}

interface DialogAttributes {
  description?: string;
  modal?: boolean;
}

export function snapshotDialog(element: SnapshotTargetElement): DialogSnapshot {
  return {
    role: "dialog",
    name: resolveAccessibleName(element, false),
    attributes: {
      description: resolveDescription(element),
      modal: booleanAttribute(element.ariaModal),
    },
    children: snapshotChildren(element),
  };
}
