import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type {
  GenericElementSnapshot,
  SetValues,
  SnapshotTargetElement,
} from "./types";

const CONTAINER_ROLES = new Set([
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
  "rowheader",
  "cell",
  "gridcell",
  "alert",
  "menu",
  "tablist",
  "tabpanel",
] as const);

export interface ContainerSnapshot
  extends GenericElementSnapshot<ContainerRole> {}

export type ContainerRole = SetValues<typeof CONTAINER_ROLES>;

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

export function isContainerRole(role: string): role is ContainerRole {
  return (CONTAINER_ROLES as Set<string>).has(role);
}
