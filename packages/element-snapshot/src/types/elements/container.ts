import type { GenericElementSnapshot } from "../snapshot";
import type { SetValues } from "../utils";

export const CONTAINER_ROLES = new Set([
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
  "descriptionlist",
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
  "label",
] as const);

export interface ContainerSnapshot extends GenericElementSnapshot<ContainerRole> {}

export type ContainerRole = SetValues<typeof CONTAINER_ROLES>;
