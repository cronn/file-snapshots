import type { DialogRole, DialogSnapshot } from "../types/elements/dialog";

import { booleanAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { discribableAttributes } from "./description";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

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
      ...discribableAttributes(element),
      modal: booleanAttribute(element.ariaModal),
    },
    children: snapshotChildren(element),
  };
}
