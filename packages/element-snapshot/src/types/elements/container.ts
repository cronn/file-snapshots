import type { GenericElementSnapshot } from "../snapshot";
import type { SetValues } from "../utils";

export const CONTAINER_ROLES = new Set([
  "paragraph",
  "blockquote",
  "code",
  "emphasis",
  "strong",
  "note",
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
  "search",
  "descriptionlist",
  "term",
  "definition",
  "table",
  "grid",
  "rowgroup",
  "row",
  "alert",
  "menu",
  "tablist",
  "tabpanel",
  "label",
] as const);

export interface ContainerSnapshot extends GenericElementSnapshot<ContainerRole> {}

export type ContainerRole = SetValues<typeof CONTAINER_ROLES>;

export interface RegionSnapshot extends GenericElementSnapshot<"region"> {}
