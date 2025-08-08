import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

export interface ContainerSnapshot
  extends GenericElementSnapshot<ContainerRole> {}

export type ContainerRole =
  | "paragraph"
  | "list"
  | "listitem"
  | "listbox"
  | LandmarkRole;

type LandmarkRole =
  | "article"
  | "banner"
  | "complementary"
  | "contentinfo"
  | "form"
  | "main"
  | "navigation"
  | "region"
  | "search";

export function snapshotContainer(
  role: ContainerRole,
  element: SnapshotTargetElement,
): ContainerSnapshot {
  const children = snapshotChildren(element);

  return {
    role,
    name: resolveAccessibleName(element, false),
    children,
  };
}
