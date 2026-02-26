import type { NodeSnapshot } from "../browser/types";

export type SnapshotFilter = (snapshot: NodeSnapshot) => boolean;

type GuardedSnapshotFilter<TSnapshot extends NodeSnapshot> = (
  snapshot: NodeSnapshot,
) => snapshot is TSnapshot;

interface SnapshotFilterOptions {
  filter: SnapshotFilter;
  snapshots: Array<NodeSnapshot>;
  recurse: boolean;
}

interface GuardedSnapshotFilterOptions<TSnapshot extends NodeSnapshot> {
  filter: GuardedSnapshotFilter<TSnapshot>;
  snapshots: Array<NodeSnapshot>;
  recurse?: boolean;
}

export function filterSnapshots<TSnapshot extends NodeSnapshot = NodeSnapshot>(
  options: GuardedSnapshotFilterOptions<TSnapshot>,
): Array<TSnapshot>;
export function filterSnapshots(
  options: SnapshotFilterOptions,
): Array<NodeSnapshot>;
export function filterSnapshots<TSnapshot extends NodeSnapshot>(
  options: SnapshotFilterOptions | GuardedSnapshotFilterOptions<TSnapshot>,
): Array<TSnapshot> {
  const { filter, snapshots, recurse = false } = options;

  return snapshots.flatMap((snapshot) => {
    const isFilteredIn = filter(snapshot);

    // end recursion on included snapshot
    if (isFilteredIn && !recurse) {
      return snapshot as TSnapshot;
    }

    // end recursion on excluded snapshot
    if (!isFilteredIn && recurse) {
      return [];
    }

    const filteredChildren = hasChildren(snapshot)
      ? filterSnapshots<TSnapshot>({
          filter: filter as GuardedSnapshotFilter<TSnapshot>,
          snapshots: snapshot.children ?? [],
          recurse,
        })
      : [];

    // recurse excluded snapshot
    if (!isFilteredIn) {
      return filteredChildren;
    }

    // recurse included snapshot
    return {
      ...snapshot,
      children: filteredChildren as Array<NodeSnapshot>,
    } as TSnapshot;
  });
}

function hasChildren(
  snapshot: NodeSnapshot,
): snapshot is NodeSnapshot & { children: Array<NodeSnapshot> } {
  return "children" in snapshot && snapshot.children.length > 0;
}
