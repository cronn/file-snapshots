import type { GenericElementSnapshot } from "../snapshot";

export interface LinkSnapshot extends GenericElementSnapshot<
  "link",
  LinkAttributes
> {}

export interface LinkAttributes {
  url?: string;
  current?: CurrentValue;
}

type CurrentValue = true | "page" | "step";
