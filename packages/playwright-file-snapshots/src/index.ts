export { defineValidationFileExpect } from "./matchers/define-expect";
export { snapshotAria } from "./aria-snapshot/snapshot";
export { snapshotDom } from "./dom-snapshot/snapshot";
export type {
  PlaywrightMatchTextFileOptions,
  PlaywrightMatchJsonFileOptions,
} from "./matchers/types";

export type {
  JsonNormalizer,
  JsonNormalizerContext,
  TextNormalizer,
} from "@cronn/lib-file-snapshots";
