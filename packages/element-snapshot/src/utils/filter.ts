import type { NodeRole, NodeSnapshot } from "../browser/types";
import type { SnapshotByRole } from "../types/snapshot";

import { isTextSnapshot } from "./guards";
import { includeRole } from "./predicates";

export type FilterPredicate = (snapshot: NodeSnapshot) => boolean;

export type GuardedFilterPredicate<TSnapshot extends NodeSnapshot> = (
  snapshot: NodeSnapshot,
) => snapshot is TSnapshot;

interface FilterOptions extends FilterBaseOptions {
  /**
   * Include only elements in the snapshot for which the specified predicate returns `true`
   */
  predicate: FilterPredicate;
}

interface GuardedFilterOptions<
  TSnapshot extends NodeSnapshot,
> extends FilterBaseOptions {
  /**
   * Include only elements in the snapshot for which the specified predicate returns `true`
   */
  predicate: GuardedFilterPredicate<TSnapshot>;
}

interface FilterBaseOptions {
  /**
   * Array of snapshots to filter.
   */
  snapshots: Array<NodeSnapshot>;

  /**
   * Recursively apply specified filter to children of filtered elements
   *
   * By default, recursion ends when the filter returns `true` for an element.
   * Should be `true` for filters intended to remove specific elements recursively.
   *
   * @default false
   */
  recurse?: boolean;
}

/**
 * Filters node snapshots based on the provided predicate function
 */
export function filter<TSnapshot extends NodeSnapshot = NodeSnapshot>(
  options: GuardedFilterOptions<TSnapshot>,
): Array<TSnapshot>;
export function filter(options: FilterOptions): Array<NodeSnapshot>;
export function filter<TSnapshot extends NodeSnapshot>(
  options: FilterOptions | GuardedFilterOptions<TSnapshot>,
): Array<TSnapshot> {
  const { predicate, snapshots, recurse = false } = options;

  return snapshots.flatMap((snapshot) => {
    const isFilteredIn = predicate(snapshot);

    // end recursion on included snapshot
    if (isFilteredIn && !recurse) {
      return snapshot as TSnapshot;
    }

    // end recursion on excluded snapshot
    if (!isFilteredIn && recurse) {
      return [];
    }

    const filteredChildren = hasChildren(snapshot)
      ? filter<TSnapshot>({
          predicate: predicate as GuardedFilterPredicate<TSnapshot>,
          snapshots: snapshot.children ?? [],
          recurse,
        })
      : [];

    // recurse excluded snapshot
    if (!isFilteredIn) {
      return filteredChildren;
    }

    // recurse included snapshot
    if (isTextSnapshot(snapshot)) {
      return snapshot as TSnapshot;
    }

    return {
      ...snapshot,
      children: filteredChildren as Array<NodeSnapshot>,
    } as TSnapshot;
  });
}

/**
 * Filters node snapshots by a specific role
 */
export function filterByRole<TRole extends NodeRole>(
  role: TRole,
  snapshots: Array<NodeSnapshot>,
): Array<SnapshotByRole<TRole>> {
  return filter({
    predicate: includeRole(role),
    recurse: false,
    snapshots,
  });
}

function hasChildren(
  snapshot: NodeSnapshot,
): snapshot is NodeSnapshot & { children: Array<NodeSnapshot> } {
  return "children" in snapshot && snapshot.children.length > 0;
}
