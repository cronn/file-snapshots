import type {
  DisableableAttributes,
  DiscribableAttributes,
  InputStateAttributes,
  SelectableAttributes,
} from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

export interface InputSnapshot extends GenericElementSnapshot<
  CommonInputRole,
  InputAttributes
> {}

export type InputRole = "combobox" | CommonInputRole;

export type CommonInputRole =
  | "button"
  | "checkbox"
  | "radio"
  | "searchbox"
  | "slider"
  | "spinbutton"
  | "textbox";

interface InputAttributes extends CommonInputAttributes {
  value?: string;
  checked?: boolean;
}

export interface CommonInputAttributes
  extends InputStateAttributes, DiscribableAttributes {
  placeholder?: string;
}

export interface ComboboxSnapshot extends GenericElementSnapshot<
  "combobox",
  ComboboxAttributes
> {}

interface ComboboxAttributes extends CommonInputAttributes {
  value?: string | Array<string>;
  options: Array<OptionSnapshot>;
}

export interface OptionSnapshot extends GenericElementSnapshot<
  "option",
  OptionAttributes
> {}

interface OptionAttributes
  extends SelectableAttributes, DisableableAttributes {}
