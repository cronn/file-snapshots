import { numericAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ProgressbarSnapshot
  extends GenericElementSnapshot<"progressbar", ProgressbarAttributes> {}

interface ProgressbarAttributes {
  value?: number;
}

export function snapshotProgressbar(
  element: SnapshotTargetElement,
): ProgressbarSnapshot {
  return {
    role: "progressbar",
    name: resolveAccessibleName(element, false),
    attributes: {
      value: resolveValue(element),
    },
    children: snapshotChildren(element),
  };
}

function resolveValue(element: SnapshotTargetElement): number | undefined {
  if (element instanceof HTMLProgressElement) {
    return element.value;
  }

  return numericAttribute(element.ariaValueNow);
}
