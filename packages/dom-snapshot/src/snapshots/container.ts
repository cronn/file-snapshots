import { snapshotChildren } from "./children";
import type {
  GenericElementSnapshot,
  NodeSnapshot,
  SnapshotTargetElement,
} from "./types";

export interface ContainerSnapshot
  extends GenericElementSnapshot<ContainerRole> {}

export type ContainerRole =
  | "main"
  | "paragraph"
  | "form"
  | "navigation"
  | "list"
  | "listitem"
  | "listbox";

export function snapshotContainer(
  role: ContainerRole,
  element: SnapshotTargetElement,
): ContainerSnapshot | Array<NodeSnapshot> | null {
  const children = snapshotChildren(element);

  return {
    role,
    children,
  };
}
