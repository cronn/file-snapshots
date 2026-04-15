import type { TextSnapshot } from "../types/elements/text";
import type { NodeRole, NodeSnapshot, SnapshotByRole } from "../types/snapshot";

export function isTextSnapshot(
  snapshot: NodeSnapshot,
): snapshot is TextSnapshot {
  return hasRole("text", snapshot);
}

export function hasRole<TRole extends NodeRole>(
  role: TRole | Array<TRole>,
  snapshot: NodeSnapshot,
): snapshot is SnapshotByRole<TRole> {
  if (typeof role === "string") {
    return role === snapshot.role;
  }

  return role.includes(snapshot.role as TRole);
}

export function isEmpty(
  value: string | Array<unknown> | Record<string, unknown>,
): boolean {
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }

  return Object.keys(value).length === 0;
}
