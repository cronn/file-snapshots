import type { ContainerRole } from "./elements/container";
import type { DialogRole } from "./elements/dialog";
import type { InputRole } from "./elements/input";

export type TextRole = "text";

export type ElementRole =
  | "button"
  | "columnheader"
  | "group"
  | "heading"
  | "img"
  | "link"
  | "menuitem"
  | "option"
  | "progressbar"
  | "radiogroup"
  | "region"
  | "separator"
  | "tab"
  | ContainerRole
  | DialogRole
  | InputRole;
