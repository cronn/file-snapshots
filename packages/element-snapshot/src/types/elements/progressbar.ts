import type { GenericElementSnapshot } from "../snapshot";

export interface ProgressbarSnapshot extends GenericElementSnapshot<
  "progressbar",
  ProgressbarAttributes
> {}

interface ProgressbarAttributes {
  value?: number;
}
