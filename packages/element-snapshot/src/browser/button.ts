import type { ButtonSnapshot } from "../types/elements/button";

import { booleanOrEnumAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import { disableableAttributes, expandableAttributes } from "./state";
import type { SnapshotTargetElement } from "./types";

const pressedValues = new Set(["mixed"] as const);

export function snapshotButton(
  element: SnapshotTargetElement,
): ButtonSnapshot | null {
  return {
    role: "button",
    name: resolveAccessibleName(element),
    attributes: {
      ...disableableAttributes(element),
      ...expandableAttributes(element),
      pressed: booleanOrEnumAttribute(element.ariaPressed, pressedValues),
    },
    children: snapshotChildren(element),
  };
}
