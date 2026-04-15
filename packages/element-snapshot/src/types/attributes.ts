export interface DisableableAttributes {
  disabled?: boolean;
}

export interface SelectableAttributes {
  selected?: boolean;
}

export interface DiscribableAttributes {
  description?: string;
}

export interface InputStateAttributes extends DisableableAttributes {
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
}
