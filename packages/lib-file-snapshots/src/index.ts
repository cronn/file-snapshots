export {
  Table,
  type TableCell,
  type TableData,
  type TableRow,
} from "./models/table";
export {
  JsonSerializer,
  type JsonNormalizer,
  type JsonNormalizerContext,
} from "./serializers/json-serializer";
export {
  MarkdownTableSerializer,
  type MarkdownTableNormalizer,
} from "./serializers/markdown-table-serializer";
export {
  TextSerializer,
  type TextNormalizer,
} from "./serializers/text-serializer";
export { ValidationFileMatcher } from "./matcher/validation-file-matcher";
export {
  resolveNameAsFile,
  resolveNameAsFileSuffix,
} from "./matcher/file-path-resolver";
export type {
  ValidationFileMatcherResult,
  FilePathResolver,
  FilePathResolverParams,
  UpdateSnapshotsType,
} from "./types/matcher";
export type { SnapshotSerializer } from "./types/serializer";
export { normalizeFileName } from "./utils/file";
export {
  isArray,
  isPlainObject,
  isString,
  type PlainObject,
} from "./utils/guards";
