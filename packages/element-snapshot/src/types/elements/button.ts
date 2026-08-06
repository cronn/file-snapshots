import type {
  DisableableAttributes,
  ExpandableAttributes,
} from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

export interface ButtonSnapshot extends GenericElementSnapshot<
  "button",
  ButtonAttributes
> {}

interface ButtonAttributes extends DisableableAttributes, ExpandableAttributes {
  pressed?: PressedValue;
}

type PressedValue = true | "mixed";
