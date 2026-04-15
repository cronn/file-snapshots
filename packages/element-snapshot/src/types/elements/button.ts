import type { DisableableAttributes } from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

export interface ButtonSnapshot extends GenericElementSnapshot<
  "button",
  ButtonAttributes
> {}

interface ButtonAttributes extends DisableableAttributes {
  expanded?: boolean;
  pressed?: PressedValue;
}

export type PressedValue = true | "mixed";
