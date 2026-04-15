import type { DiscribableAttributes } from "../attributes";
import type { GenericElementSnapshot } from "../snapshot";

export interface GroupSnapshot extends GenericElementSnapshot<"group"> {}

export interface RadioGroupSnapshot extends GenericElementSnapshot<
  "radiogroup",
  RadiogroupAttributes
> {}

interface RadiogroupAttributes extends DiscribableAttributes {}
