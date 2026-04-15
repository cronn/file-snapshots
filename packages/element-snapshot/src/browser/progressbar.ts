import type { ProgressbarSnapshot } from "../types/elements/progressbar";

import { numericAttribute } from "./attribute";
import { resolveAccessibleName } from "./name";
import { snapshotPresentationalChildren } from "./text";
import type { SnapshotTargetElement } from "./types";

export function snapshotProgressbar(
  element: SnapshotTargetElement,
): ProgressbarSnapshot {
  return {
    role: "progressbar",
    name: resolveAccessibleName(element, false),
    attributes: {
      value: resolveValue(element),
    },
    children: snapshotPresentationalChildren(element),
  };
}

function resolveValue(element: SnapshotTargetElement): number | undefined {
  if (element instanceof HTMLProgressElement) {
    return element.value;
  }

  return numericAttribute(element.ariaValueNow);
}
