import type { TextSnapshot } from "../types/elements/text";
import type { ElementRole } from "../types/role";
import type { ElementSnapshot, NodeSnapshot } from "../types/snapshot";
import type { FilterPredicate } from "../utils/filter";
import { filter } from "../utils/filter";
import { isEmpty, isTextSnapshot } from "../utils/guards";

interface NormalizedElementSnapshot {
  role: ElementRole;
  name: string;
  attributes: Record<string, unknown>;
  children: Array<unknown>;
}

interface SemanticSnapshotTransformerOptions {
  filter?: FilterPredicate;
  recurseFilter?: boolean;
  includeComboboxOptions?: boolean;
}

export class SemanticSnapshotTransformer {
  private readonly filter?: FilterPredicate;
  private readonly recurseFilter: boolean;
  private readonly includeComboboxOptions: boolean;

  public constructor(options: SemanticSnapshotTransformerOptions = {}) {
    this.filter = options.filter;
    this.recurseFilter = options.recurseFilter ?? false;
    this.includeComboboxOptions = options.includeComboboxOptions ?? false;
  }

  public transform(snapshots: Array<NodeSnapshot>): unknown {
    const filteredSnapshots = this.filterSnapshots(snapshots);
    const transformedSnapshots = this.transformSnapshots(filteredSnapshots);

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

  private transformSnapshots(snapshots: Array<NodeSnapshot>): Array<unknown> {
    return snapshots.map((snapshot) =>
      this.transformSnapshotRecursive(snapshot),
    );
  }

  private transformSnapshotRecursive(snapshot: NodeSnapshot): unknown {
    if (isTextSnapshot(snapshot)) {
      return this.simplifyTextSnapshot(snapshot);
    }

    return this.simplifyElementSnapshot(snapshot);
  }

  private simplifyTextSnapshot(snapshot: TextSnapshot): string {
    return snapshot.name;
  }

  private simplifyElementSnapshot(snapshot: ElementSnapshot): unknown {
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
    return this.transformedSnapshot(role, {
      name: name.length === 0 ? undefined : name,
      ...attributes,
      children: children.length === 0 ? undefined : children,
    });
  }

  private normalizeElementSnapshot(
    snapshot: ElementSnapshot,
  ): NormalizedElementSnapshot {
    const normalizedName = snapshot.name ?? "";
    const transformedAttributes = this.transformAttributes(snapshot);
    const transformedChildren = this.transformSnapshots(snapshot.children);
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

  private transformAttributes(
    snapshot: ElementSnapshot,
  ): Record<string, unknown> {
    const { attributes } = snapshot;
    const filteredAttributes: Record<string, unknown> = {};
    const attributeNames = Object.keys(attributes) as Array<
      keyof typeof attributes
    >;

    attributeNames.forEach((attributeName) => {
      const transformedAttribute = this.transformAttribute(
        attributeName,
        snapshot,
      );

      if (transformedAttribute === undefined) {
        return;
      }

      filteredAttributes[attributeName] = transformedAttribute;
    });

    return filteredAttributes;
  }

  private transformAttribute(
    name: keyof ElementSnapshot["attributes"],
    snapshot: ElementSnapshot,
  ): unknown {
    const { role, attributes } = snapshot;

    if (role === "combobox" && name === "options") {
      const transformedOptions = attributes.options.map((optionSnapshot) =>
        this.simplifyElementSnapshot(optionSnapshot),
      );

      return this.includeComboboxOptions && transformedOptions.length > 0
        ? transformedOptions
        : undefined;
    }

    return attributes[name];
  }

  private transformedSnapshot(role: ElementRole, content: unknown): unknown {
    return { [role]: content };
  }
}
