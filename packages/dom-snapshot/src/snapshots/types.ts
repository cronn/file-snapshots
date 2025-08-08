import type { ButtonSnapshot } from "./button";
import type { ContainerRole, ContainerSnapshot } from "./container";
import type { HeadingSnapshot } from "./heading";
import type { InputRole, InputSnapshot } from "./input";
import type { LinkSnapshot } from "./link";
import type { TextSnapshot } from "./text";

export type SnapshotTargetNode = SnapshotTargetElement | ChildNode;

export type SnapshotTargetElement = HTMLElement | SVGElement;

export type NodeRole = ElementRole | "text";

export type ElementRole =
  | "heading"
  | "link"
  | "button"
  | "option"
  | ContainerRole
  | InputRole;

export type NodeSnapshot = ElementSnapshot | TextSnapshot;

export type ElementSnapshot =
  | ContainerSnapshot
  | HeadingSnapshot
  | LinkSnapshot
  | ButtonSnapshot
  | InputSnapshot;

export interface GenericElementSnapshot<
  TRole extends NodeRole = NodeRole,
  TAttributes = unknown,
> {
  role: TRole;
  name?: string;
  attributes?: TAttributes;
  children?: Array<NodeSnapshot>;
}
