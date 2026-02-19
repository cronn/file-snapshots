import type { GenericElementSnapshot, NodeSnapshot } from "../browser/types";

export type SnapshotFilter = (snapshot: NodeSnapshot) => boolean;

type GuardedSnapshotFilter<TSnapshot extends NodeSnapshot> = (
  snapshot: NodeSnapshot,
) => snapshot is TSnapshot;

type FilteredSnapshot<TSnapshot extends NodeSnapshot> =
  TSnapshot extends GenericElementSnapshot
    ? TSnapshot & { children?: Array<TSnapshot> }
    : TSnapshot;

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
): Array<FilteredSnapshot<TSnapshot>>;
export function filterSnapshots(
  options: SnapshotFilterOptions,
): Array<NodeSnapshot>;
export function filterSnapshots<TSnapshot extends NodeSnapshot>(
  options: SnapshotFilterOptions | GuardedSnapshotFilterOptions<TSnapshot>,
): Array<FilteredSnapshot<TSnapshot>> {
  const { filter, snapshots, recurse = false } = options;

  return snapshots.flatMap((snapshot) => {
    const isFilteredIn = filter(snapshot);

    // end recursion on filtered in snapshot
    if (isFilteredIn && !recurse) {
      return snapshot as FilteredSnapshot<TSnapshot>;
    }

    // end recursion on filtered out snapshot
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

    if (!isFilteredIn) {
      return filteredChildren;
    }

    return {
      ...snapshot,
      children: filteredChildren.length > 0 ? filteredChildren : undefined,
    } as FilteredSnapshot<TSnapshot>;
  });
}

function hasChildren(
  snapshot: NodeSnapshot,
): snapshot is NodeSnapshot & { children: Array<NodeSnapshot> } {
  return (
    "children" in snapshot &&
    snapshot.children !== undefined &&
    snapshot.children.length > 0
  );
}
