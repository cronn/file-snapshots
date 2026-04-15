import type { GenericElementSnapshot } from "../snapshot";

export interface LinkSnapshot extends GenericElementSnapshot<
  "link",
  LinkAttributes
> {}

export interface LinkAttributes {
  url?: string;
}
