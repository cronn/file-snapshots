import type { ContainerRole } from "./elements/container";
import type { DialogRole } from "./elements/dialog";
import type { InputRole } from "./elements/input";
import type { CellRole } from "./elements/table";

export type TextRole = "text";

export type ElementRole =
  | "button"
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
  | CellRole
  | ContainerRole
  | DialogRole
  | InputRole;
