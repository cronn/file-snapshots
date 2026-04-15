import type { DiscribableAttributes } from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

export interface DialogSnapshot extends GenericElementSnapshot<
  DialogRole,
  DialogAttributes
> {}

export type DialogRole = "dialog" | "alertdialog";

interface DialogAttributes extends DiscribableAttributes {
  modal?: boolean;
}
