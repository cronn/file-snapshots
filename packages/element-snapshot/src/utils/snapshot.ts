import type { GenericElementSnapshot, NodeSnapshot } from "../browser/types";

export type SnapshotFilter = (snapshot: NodeSnapshot) => boolean;

type GuardedSnapshotFilter<TSnapshot extends NodeSnapshot> = (
  snapshot: NodeSnapshot,
) => snapshot is TSnapshot;

type FilteredSnapshot<TSnapshot extends NodeSnapshot> =
  TSnapshot extends GenericElementSnapshot
    ? TSnapshot & { children?: Array<TSnapshot> }
    : TSnapshot;

export function filterSnapshots<TSnapshot extends NodeSnapshot = NodeSnapshot>(
  snapshots: Array<NodeSnapshot>,
  filter: GuardedSnapshotFilter<TSnapshot>,
): Array<TSnapshot>;
export function filterSnapshots(
  snapshots: Array<NodeSnapshot>,
  filter: SnapshotFilter,
): Array<NodeSnapshot>;
export function filterSnapshots<TSnapshot extends NodeSnapshot>(
  snapshots: Array<NodeSnapshot>,
  filter: SnapshotFilter | GuardedSnapshotFilter<TSnapshot>,
): Array<FilteredSnapshot<TSnapshot>> {
  return snapshots.flatMap((snapshot) => {
    const filteredChildren = hasChildren(snapshot)
      ? filterSnapshots(snapshot.children ?? [], filter)
      : [];

    if (filter(snapshot)) {
      return {
        ...snapshot,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      } as FilteredSnapshot<TSnapshot>;
    }

    return filteredChildren as Array<FilteredSnapshot<TSnapshot>>;
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
