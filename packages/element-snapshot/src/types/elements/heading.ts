import type { GenericElementSnapshot } from "../snapshot";

export interface HeadingSnapshot extends GenericElementSnapshot<
  "heading",
  HeadingAttributes
> {}

interface HeadingAttributes {
  level?: number;
}
