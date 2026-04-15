import type {
  DisableableAttributes,
  SelectableAttributes,
} from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

export interface TabSnapshot extends GenericElementSnapshot<
  "tab",
  TabAttributes
> {}

interface TabAttributes extends DisableableAttributes, SelectableAttributes {}
