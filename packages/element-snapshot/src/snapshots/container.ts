import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { GenericElementSnapshot, SnapshotTargetElement } from "./types";

const CONTAINER_ROLES = [
  "paragraph",
  "list",
  "listitem",
  "listbox",
  "article",
  "banner",
  "complementary",
  "contentinfo",
  "form",
  "main",
  "navigation",
  "region",
  "search",
  "term",
  "definition",
  "table",
  "grid",
  "rowgroup",
  "row",
  "columnheader",
  "rowheader",
  "cell",
  "gridcell",
  "alert",
  "menu",
  "menuitem",
  "tablist",
  "tabpanel",
] as const;

export interface ContainerSnapshot
  extends GenericElementSnapshot<ContainerRole> {}

export type ContainerRole = (typeof CONTAINER_ROLES)[number];

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

const CONTAINER_ROLES_SET = new Set<string>(CONTAINER_ROLES);

export function isContainerRole(role: string): role is ContainerRole {
  return CONTAINER_ROLES_SET.has(role);
}
