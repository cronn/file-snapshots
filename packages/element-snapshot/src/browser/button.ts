import type { ButtonSnapshot, PressedValue } from "../types/elements/button";

import { booleanAttribute, enumAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import { disableableAttributes } from "./state";
import type { SnapshotTargetElement } from "./types";

const PRESSED_VALUES = new Set(["true", "mixed", "false"] as const);

export function snapshotButton(
  element: SnapshotTargetElement,
): ButtonSnapshot | null {
  return {
    role: "button",
    name: resolveAccessibleName(element),
    attributes: {
      ...disableableAttributes(element),
      expanded: booleanAttribute(element.ariaExpanded),
      pressed: resolvePressedAttribute(element),
    },
    children: snapshotChildren(element),
  };
}

function resolvePressedAttribute(
  element: SnapshotTargetElement,
): PressedValue | undefined {
  const pressed = enumAttribute(element.ariaPressed, PRESSED_VALUES);
  if (pressed === "mixed") {
    return pressed;
  }

  return booleanAttribute(pressed === "true");
}
