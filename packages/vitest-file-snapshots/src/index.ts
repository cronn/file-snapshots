export type {
  VitestMatchTextFileOptions,
  VitestMatchJsonFileOptions,
} from "./matchers/types";

export {
  normalizeFileName,
  resolveNameAsFile,
  resolveNameAsFileSuffix,
} from "@cronn/lib-file-snapshots";
export type {
  JsonNormalizer,
  JsonNormalizerContext,
  TextNormalizer,
} from "@cronn/lib-file-snapshots";
