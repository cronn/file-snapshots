import { comboboxTransformer } from "../transformers/combobox";
import type { TextSnapshot } from "../types/elements/text";
import type { ElementRole } from "../types/role";
import type { ElementSnapshot, NodeSnapshot } from "../types/snapshot";
import type {
  SnapshotTransform,
  SnapshotTransformer,
  SnapshotTransformers,
  TransformableElementSnapshot,
} from "../types/transformer";
import type { FilterPredicate } from "../utils/filter";
import { filter } from "../utils/filter";
import { isEmpty } from "../utils/guards";

interface NormalizedElementSnapshot {
  role: ElementRole;
  name: string;
  attributes: Record<string, unknown>;
  children: Array<unknown>;
}

interface SemanticSnapshotSerializerOptions {
  filter?: FilterPredicate;
  recurseFilter?: boolean;
  transformers?: SnapshotTransformers;
}

export class SemanticSnapshotSerializer {
  private readonly filter?: FilterPredicate;
  private readonly recurseFilter: boolean;
  private readonly transformers: SnapshotTransformers;

  public constructor(options: SemanticSnapshotSerializerOptions = {}) {
    this.filter = options.filter;
    this.recurseFilter = options.recurseFilter ?? false;
    this.transformers = {
      combobox: comboboxTransformer(),
      ...options.transformers,
    };
  }

  public transform(snapshots: Array<NodeSnapshot>): unknown {
    const filteredSnapshots = this.filterSnapshots(snapshots);
    const transformedSnapshots = this.transformSnapshots(filteredSnapshots);

    if (transformedSnapshots.length === 1) {
      return transformedSnapshots.at(0);
    }

    return transformedSnapshots;
  }

  private readonly defaultTransform: SnapshotTransform = (snapshot) => {
    if (snapshot.role === "text") {
      return this.simplifyTextSnapshot(snapshot);
    }

    return this.simplifyElementSnapshot(snapshot);
  };

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

  private transformSnapshots(snapshots: Array<NodeSnapshot>): Array<unknown> {
    return snapshots.map((snapshot) =>
      this.transformSnapshotRecursive(snapshot),
    );
  }

  private transformSnapshotRecursive(snapshot: NodeSnapshot): unknown {
    const transformer = this.transformers[snapshot.role] as
      | SnapshotTransformer
      | undefined;

    if (transformer !== undefined) {
      return transformer(snapshot, { transform: this.defaultTransform });
    }

    return this.defaultTransform(snapshot);
  }

  private simplifyTextSnapshot(snapshot: TextSnapshot): string {
    return snapshot.name;
  }

  private simplifyElementSnapshot(
    snapshot: ElementSnapshot | TransformableElementSnapshot,
  ): unknown {
    const normalizedSnapshot = this.normalizeElementSnapshot(snapshot);

    if (this.isEmpty(normalizedSnapshot)) {
      const { role } = normalizedSnapshot;
      return this.transformedSnapshot(role, "");
    }

    if (this.hasOnlyName(normalizedSnapshot)) {
      const { role, name } = normalizedSnapshot;
      return this.transformedSnapshot(role, name);
    }

    if (this.hasOnlyChildren(normalizedSnapshot)) {
      const { role, children } = normalizedSnapshot;
      return this.transformedSnapshot(
        role,
        children.length === 1 ? children.at(0) : children,
      );
    }

    const { role, name, attributes, children } = normalizedSnapshot;
    return this.transformedSnapshot(role, name, {
      ...attributes,
      children: children.length === 0 ? undefined : children,
    });
  }

  private normalizeElementSnapshot(
    snapshot: ElementSnapshot | TransformableElementSnapshot,
  ): NormalizedElementSnapshot {
    const normalizedName = snapshot.name ?? "";
    const transformedAttributes = this.transformAttributes(
      snapshot.attributes ?? {},
    );
    const transformedChildren = this.transformSnapshots(
      snapshot.children ?? [],
    );
    const nameEqualsChildren =
      transformedChildren.length === 1 &&
      normalizedName === transformedChildren.at(0);

    return {
      role: snapshot.role,
      name: normalizedName,
      attributes: transformedAttributes,
      children: nameEqualsChildren ? [] : transformedChildren,
    };
  }

  private isEmpty(snapshot: NormalizedElementSnapshot): boolean {
    return (
      isEmpty(snapshot.name) &&
      isEmpty(snapshot.attributes) &&
      isEmpty(snapshot.children)
    );
  }

  private hasOnlyName(snapshot: NormalizedElementSnapshot): boolean {
    return (
      !isEmpty(snapshot.name) &&
      isEmpty(snapshot.attributes) &&
      isEmpty(snapshot.children)
    );
  }

  private hasOnlyChildren(snapshot: NormalizedElementSnapshot): boolean {
    return (
      isEmpty(snapshot.name) &&
      isEmpty(snapshot.attributes) &&
      !isEmpty(snapshot.children)
    );
  }

  private transformAttributes(attributes: object): Record<string, unknown> {
    const filteredAttributes: Record<string, unknown> = {};

    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
      if (attributeValue === undefined) {
        return;
      }

      filteredAttributes[attributeName] = attributeValue;
    });

    return filteredAttributes;
  }

  private transformedSnapshot(
    role: ElementRole,
    nameOrContent: unknown,
    additionalProperties?: Record<string, unknown>,
  ): unknown {
    return { [role]: nameOrContent, ...additionalProperties };
  }
}
