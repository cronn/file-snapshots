import type { NodeRole, NodeSnapshot } from "../browser/types";
import type { SnapshotByRole } from "../types/snapshot";

import type { GuardedFilterPredicate } from "./filter";

export function includeRole<TRole extends NodeRole>(
  role: TRole,
): GuardedFilterPredicate<SnapshotByRole<TRole>> {
  return (snapshot: NodeSnapshot): snapshot is SnapshotByRole<TRole> =>
    snapshot.role === role;
}

export function excludeRole<TRole extends NodeRole>(
  role: TRole,
): GuardedFilterPredicate<SnapshotByRole<TRole>> {
  return (snapshot: NodeSnapshot): snapshot is SnapshotByRole<TRole> =>
    snapshot.role !== role;
}
