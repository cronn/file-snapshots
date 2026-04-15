import type { DisableableAttributes } from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

import type { LinkAttributes } from "./link";

export interface MenuItemSnapshot extends GenericElementSnapshot<
  "menuitem",
  MenuitemAttributes
> {}

interface MenuitemAttributes extends LinkAttributes, DisableableAttributes {}
