export type { ElementRole } from "./types/role";
export type { ElementSnapshot, NodeRole, NodeSnapshot } from "./types/snapshot";
export type { TextSnapshot } from "./types/elements/text";
export type { ButtonSnapshot } from "./types/elements/button";
export type {
  ContainerSnapshot,
  RegionSnapshot,
} from "./types/elements/container";
export type { DialogSnapshot } from "./types/elements/dialog";
export type { GroupSnapshot, RadioGroupSnapshot } from "./types/elements/group";
export type { HeadingSnapshot } from "./types/elements/heading";
export type { ImageSnapshot } from "./types/elements/image";
export type {
  ComboboxSnapshot,
  InputSnapshot,
  OptionSnapshot,
} from "./types/elements/input";
export type { LinkSnapshot } from "./types/elements/link";
export type { MenuItemSnapshot } from "./types/elements/list";
export type { ProgressbarSnapshot } from "./types/elements/progressbar";
export type { SeparatorSnapshot } from "./types/elements/separator";
export type { TabSnapshot } from "./types/elements/tab";
export type { ColumnHeaderSnapshot } from "./types/elements/table";

export {
  markdownTableSnapshot,
  type MarkdownTableSnapshotOptions,
} from "./playwright/markdown-table";
export {
  rawSnapshot,
  semanticSnapshot,
  type SemanticSnapshotOptions,
} from "./playwright/snapshot";

export type { SnapshotByRole } from "./types/snapshot";

export { filter, filterByRole } from "./utils/filter";
export { includeRole, excludeRole } from "./utils/predicates";
export { getTextContent } from "./utils/text";
