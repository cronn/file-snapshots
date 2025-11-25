import type { ButtonSnapshot } from "./button";
import type { ComboboxSnapshot, OptionSnapshot } from "./combobox";
import type { ContainerRole, ContainerSnapshot } from "./container";
import type { DialogRole, DialogSnapshot } from "./dialog";
import type { GroupSnapshot } from "./group";
import type { HeadingSnapshot } from "./heading";
import type { InputRole, InputSnapshot } from "./input";
import type { LinkSnapshot } from "./link";
import type { MenuitemSnapshot } from "./list";
import type { TabSnapshot } from "./tab";
import type { ColumnheaderSnapshot } from "./table";
import type { TextSnapshot } from "./text";

export type SnapshotTargetNode = SnapshotTargetElement | ChildNode;

export type SnapshotTargetElement = HTMLElement | SVGElement;

export type ElementTagName = keyof HTMLElementTagNameMap;

export type NodeRole = ElementRole | "text";

export type ElementRole =
  | "heading"
  | "link"
  | "button"
  | "option"
  | "tab"
  | "menuitem"
  | "columnheader"
  | "group"
  | ContainerRole
  | InputRole
  | DialogRole;

export type NodeSnapshot = ElementSnapshot | TextSnapshot;

export type ElementSnapshot =
  | ContainerSnapshot
  | HeadingSnapshot
  | LinkSnapshot
  | ButtonSnapshot
  | InputSnapshot
  | ComboboxSnapshot
  | OptionSnapshot
  | DialogSnapshot
  | TabSnapshot
  | MenuitemSnapshot
  | ColumnheaderSnapshot
  | GroupSnapshot;

export interface GenericElementSnapshot<
  TRole extends NodeRole = NodeRole,
  TAttributes = unknown,
> {
  role: TRole;
  name?: string;
  attributes?: TAttributes;
  children?: Array<NodeSnapshot>;
}

export type SetValues<TSet> = TSet extends Set<infer TValue> ? TValue : never;
