export type {
  ElementRole,
  ElementSnapshot,
  NodeRole,
  NodeSnapshot,
} from "./browser/types";
export type { TextSnapshot } from "./browser/text";

export type { ButtonSnapshot } from "./browser/button";
export type { ComboboxSnapshot, OptionSnapshot } from "./browser/combobox";
export type { ContainerSnapshot } from "./browser/container";
export type { DialogSnapshot } from "./browser/dialog";
export type { GroupSnapshot, RadiogroupSnapshot } from "./browser/group";
export type { HeadingSnapshot } from "./browser/heading";
export type { ImageSnapshot } from "./browser/image";
export type { InputSnapshot } from "./browser/input";
export type { LinkSnapshot } from "./browser/link";
export type { MenuitemSnapshot } from "./browser/list";
export type { ProgressbarSnapshot } from "./browser/progressbar";
export type { SeparatorSnapshot } from "./browser/separator";
export type { TabSnapshot } from "./browser/tab";
export type { ColumnheaderSnapshot } from "./browser/table";

export { snapshotElement, snapshotElementRaw } from "./playwright/snapshot";
