import type {
  CheckableAttributes,
  DisableableAttributes,
  ExpandableAttributes,
  SelectableAttributes,
} from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

export interface TreeItemSnapshot extends GenericElementSnapshot<
  "treeitem",
  TreeItemAttributes
> {}

interface TreeItemAttributes
  extends
    CheckableAttributes,
    DisableableAttributes,
    ExpandableAttributes,
    SelectableAttributes {}
