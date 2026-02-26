import type { TextSnapshot } from "../browser/text";
import type { NodeSnapshot } from "../browser/types";

export function isTextSnapshot(
  snapshot: NodeSnapshot,
): snapshot is TextSnapshot {
  return snapshot.role === "text";
}

export function isEmpty(
  value: string | Array<unknown> | Record<string, unknown>,
): boolean {
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }

  return Object.keys(value).length === 0;
}
