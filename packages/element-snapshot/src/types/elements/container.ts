import type { GenericElementSnapshot } from "../snapshot";
import type { SetValues } from "../utils";

export const CONTAINER_ROLES = new Set([
  "alert",
  "article",
  "banner",
  "blockquote",
  "code",
  "complementary",
  "contentinfo",
  "definition",
  "descriptionlist",
  "emphasis",
  "form",
  "grid",
  "label",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "menu",
  "navigation",
  "note",
  "paragraph",
  "row",
  "rowgroup",
  "search",
  "status",
  "strong",
  "table",
  "tablist",
  "tabpanel",
  "term",
] as const);

export interface ContainerSnapshot extends GenericElementSnapshot<ContainerRole> {}

export type ContainerRole = SetValues<typeof CONTAINER_ROLES>;

export interface RegionSnapshot extends GenericElementSnapshot<"region"> {}
