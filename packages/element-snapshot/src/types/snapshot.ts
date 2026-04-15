import type { ButtonSnapshot } from "./elements/button";
import type { ContainerSnapshot } from "./elements/container";
import type { DialogSnapshot } from "./elements/dialog";
import type { GroupSnapshot, RadioGroupSnapshot } from "./elements/group";
import type { HeadingSnapshot } from "./elements/heading";
import type { ImageSnapshot } from "./elements/image";
import type {
  ComboboxSnapshot,
  InputSnapshot,
  OptionSnapshot,
} from "./elements/input";
import type { LinkSnapshot } from "./elements/link";
import type { MenuItemSnapshot } from "./elements/list";
import type { ProgressbarSnapshot } from "./elements/progressbar";
import type { SeparatorSnapshot } from "./elements/separator";
import type { TabSnapshot } from "./elements/tab";
import type { ColumnHeaderSnapshot } from "./elements/table";
import type { TextSnapshot } from "./elements/text";
import type { ElementRole, TextRole } from "./role";

export type NodeRole = ElementRole | TextRole;

export type NodeSnapshot = ElementSnapshot | TextSnapshot;

export type SnapshotByRole<TRole extends NodeRole> = NodeSnapshot & {
  role: TRole;
};

export interface GenericElementSnapshot<
  TRole extends NodeRole = NodeRole,
  TAttributes = Record<string, unknown>,
> {
  role: TRole;
  name?: string;
  attributes: TAttributes;
  children: Array<NodeSnapshot>;
}

export type ElementSnapshot =
  | ButtonSnapshot
  | ColumnHeaderSnapshot
  | ComboboxSnapshot
  | ContainerSnapshot
  | DialogSnapshot
  | GroupSnapshot
  | HeadingSnapshot
  | ImageSnapshot
  | InputSnapshot
  | LinkSnapshot
  | OptionSnapshot
  | ProgressbarSnapshot
  | TabSnapshot
  | MenuItemSnapshot
  | RadioGroupSnapshot
  | SeparatorSnapshot;
