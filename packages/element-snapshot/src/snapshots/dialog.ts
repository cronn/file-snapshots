import { booleanAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveDescription } from "./description";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface DialogSnapshot
  extends GenericElementSnapshot<DialogRole, DialogAttributes> {}

export type DialogRole = "dialog" | "alertdialog";

interface DialogAttributes {
  description?: string;
  modal?: boolean;
}

type DialogSnapshotFn = (element: SnapshotTargetElement) => DialogSnapshot;

export function snapshotDialogWithRole(role: DialogRole): DialogSnapshotFn {
  return (element) => snapshotDialog(role, element);
}

function snapshotDialog(
  role: DialogRole,
  element: SnapshotTargetElement,
): DialogSnapshot {
  return {
    role,
    name: resolveAccessibleName(element, false),
    attributes: {
      description: resolveDescription(element),
      modal: booleanAttribute(element.ariaModal),
    },
    children: snapshotChildren(element),
  };
}
