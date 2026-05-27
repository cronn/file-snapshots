export {
  defineJsonFileMatcher,
  defineTextFileMatcher,
  defineFileSnapshotMatchers,
} from "./matchers/define-matchers";
export type {
  PlaywrightMatchValidationFileOptions,
  PlaywrightMatchTextFileOptions,
  PlaywrightMatchJsonFileOptions,
  PlaywrightValidationFileMatcherConfig,
  PlaywrightValidationFileMatchers,
} from "./matchers/types";

export {
  maskPattern,
  maskString,
  normalizeFileName,
  resolveNameAsFile,
  resolveNameAsFileSuffix,
  stringNormalizer,
} from "@cronn/lib-file-snapshots";
export type {
  FilePathResolver,
  FilePathResolverParams,
  JsonNormalizer,
  JsonNormalizerContext,
  Normalizer,
  NormalizerWithContext,
  TextNormalizer,
} from "@cronn/lib-file-snapshots";
