import type { NodeRole, NodeSnapshot } from "../browser/types";
import type { SnapshotByRole } from "../types/snapshot";

import type { GuardedFilterPredicate } from "./filter";
import { hasRole } from "./guards";

/**
 * Include only elements with the specified role
 */
export function includeRole<TRole extends NodeRole>(
  role: TRole | Array<TRole>,
): GuardedFilterPredicate<SnapshotByRole<TRole>> {
  return (snapshot: NodeSnapshot) => hasRole(role, snapshot);
}

/**
 * Exclude elements with the specified role
 */
export function excludeRole<TRole extends NodeRole>(
  role: TRole | Array<TRole>,
): GuardedFilterPredicate<SnapshotByRole<TRole>> {
  return (snapshot: NodeSnapshot): snapshot is SnapshotByRole<TRole> =>
    !hasRole(role, snapshot);
}
