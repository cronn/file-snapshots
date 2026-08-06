export interface DisableableAttributes {
  disabled?: boolean;
}

export interface SelectableAttributes {
  selected?: boolean;
}

export interface ExpandableAttributes {
  expanded?: boolean;
}

export interface CheckableAttributes {
  checked?: CheckedValue;
}

type CheckedValue = true | "mixed";

export interface DiscribableAttributes {
  description?: string;
}

export interface InputStateAttributes extends DisableableAttributes {
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
}
