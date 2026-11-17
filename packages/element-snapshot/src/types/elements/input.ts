import type {
  CheckableAttributes,
  DisableableAttributes,
  DiscribableAttributes,
  ExpandableAttributes,
  InputStateAttributes,
  MultiselectableAttributes,
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

interface InputAttributes extends CommonInputAttributes, CheckableAttributes {
  value?: string;
}

export interface CommonInputAttributes
  extends InputStateAttributes, DiscribableAttributes {
  placeholder?: string;
}

export interface ComboboxSnapshot extends GenericElementSnapshot<
  "combobox",
  ComboboxAttributes
> {}

interface SelectionInputAttributes
  extends CommonInputAttributes, ExpandableAttributes {}

interface ComboboxAttributes extends SelectionInputAttributes {
  value?: string | Array<string>;
}

export interface OptionSnapshot extends GenericElementSnapshot<
  "option",
  OptionAttributes
> {}

interface OptionAttributes
  extends SelectableAttributes, DisableableAttributes {}

export interface ListboxSnapshot extends GenericElementSnapshot<
  "listbox",
  ListboxAttributes
> {}

interface ListboxAttributes
  extends SelectionInputAttributes, MultiselectableAttributes {}
