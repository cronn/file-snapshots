import { comboboxTransformer } from "../transformers/combobox-transformer";
import { semanticSnapshotTransformer } from "../transformers/semantic-snapshot-transformer";
import type { NodeSnapshot } from "../types/snapshot";
import type {
  DefaultSnapshotTransformer,
  RoleBasedSnapshotTransformer,
  RoleBasedSnapshotTransformers,
} from "../types/transformer";
import type { FilterPredicate } from "../utils/filter";
import { filter } from "../utils/filter";

interface SnapshotSerializerOptions {
  filter?: FilterPredicate;
  recurseFilter?: boolean;
  transformers?: RoleBasedSnapshotTransformers;
  defaultTransformer?: DefaultSnapshotTransformer;
}

export class SnapshotSerializer {
  private readonly filter?: FilterPredicate;
  private readonly recurseFilter: boolean;
  private readonly transformers: RoleBasedSnapshotTransformers;
  private readonly defaultTransformer: DefaultSnapshotTransformer;

  public constructor(options: SnapshotSerializerOptions = {}) {
    this.filter = options.filter;
    this.recurseFilter = options.recurseFilter ?? false;
    this.transformers = {
      combobox: comboboxTransformer(),
      ...options.transformers,
    };
    this.defaultTransformer =
      options.defaultTransformer ?? semanticSnapshotTransformer;
  }

  public transform(snapshots: Array<NodeSnapshot>): unknown {
    const filteredSnapshots = this.filterSnapshots(snapshots);
    const transformedSnapshots = filteredSnapshots.map(
      this.transformSnapshotRecursive,
    );

    if (transformedSnapshots.length === 1) {
      return transformedSnapshots.at(0);
    }

    return transformedSnapshots;
  }

  private filterSnapshots(snapshots: Array<NodeSnapshot>): Array<NodeSnapshot> {
    if (this.filter === undefined) {
      return snapshots;
    }

    return filter({
      predicate: this.filter,
      snapshots,
      recurse: this.recurseFilter,
    });
  }

  private readonly boundDefaultTransformer = (
    snapshot: NodeSnapshot,
  ): unknown =>
    this.defaultTransformer(snapshot, {
      transform: this.transformSnapshotRecursive,
    });

  private readonly transformSnapshotRecursive = (
    snapshot: NodeSnapshot,
  ): unknown => {
    const transformer = this.transformers[snapshot.role] as
      | RoleBasedSnapshotTransformer
      | undefined;

    if (transformer !== undefined) {
      return transformer(snapshot, { transform: this.boundDefaultTransformer });
    }

    return this.defaultTransformer(snapshot, {
      transform: this.transformSnapshotRecursive,
    });
  };
}
