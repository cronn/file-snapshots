export { defineValidationFileExpect } from "./matchers/define-expect";
export { snapshotAria } from "./aria-snapshot/snapshot";
export {
  snapshotElement,
  snapshotElementRaw,
} from "./element-snapshot/snapshot";
export type {
  PlaywrightMatchValidationFileOptions,
  PlaywrightMatchTextFileOptions,
  PlaywrightMatchJsonFileOptions,
} from "./matchers/types";

export type {
  NodeSnapshot,
  ElementSnapshot,
  TextSnapshot,
} from "@cronn/element-snapshot/types";

export {
  normalizeFileName,
  resolveNameAsFile,
  resolveNameAsFileSuffix,
} from "@cronn/lib-file-snapshots";
export type {
  FilePathResolver,
  FilePathResolverParams,
  JsonNormalizer,
  JsonNormalizerContext,
  TextNormalizer,
} from "@cronn/lib-file-snapshots";
