import type { ComboboxSnapshot } from "../browser/combobox";
import type { TextSnapshot } from "../browser/text";
import type {
  ElementRole,
  ElementSnapshot,
  NodeSnapshot,
} from "../browser/types";
import { isEmpty, isTextSnapshot } from "../utils/guards";
import type { SnapshotFilter } from "../utils/snapshot";
import { filterSnapshots } from "../utils/snapshot";

interface NormalizedElementSnapshot {
  role: ElementRole;
  name: string;
  attributes: Record<string, unknown>;
  children: Array<unknown>;
}

interface DomSnapshotTransformerOptions {
  filter?: SnapshotFilter;
  recurseFilter?: boolean;
  includeComboboxOptions?: boolean;
}

export class ElementSnapshotTransformer {
  private readonly filter?: SnapshotFilter;
  private readonly recurseFilter: boolean;
  private readonly includeComboboxOptions: boolean;

  public constructor(options: DomSnapshotTransformerOptions = {}) {
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

    return filterSnapshots({
      filter: this.filter,
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

    if (snapshot.role === "combobox") {
      return this.simplifyComboboxSnapshot(snapshot);
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
    const sparseAttributes = this.removeUndefinedProperties(
      snapshot.attributes as Record<string, unknown>,
    );
    const transformedChildren = this.transformSnapshots(snapshot.children);
    const nameEqualsChildren =
      transformedChildren.length === 1 &&
      normalizedName === transformedChildren.at(0);

    return {
      role: snapshot.role,
      name: normalizedName,
      attributes: sparseAttributes,
      children: nameEqualsChildren ? [] : transformedChildren,
    };
  }

  private simplifyComboboxSnapshot(snapshot: ComboboxSnapshot): unknown {
    const { role, name, attributes } = this.normalizeElementSnapshot(snapshot);
    const transformedOptions = snapshot.options.map((optionSnapshot) =>
      this.simplifyElementSnapshot(optionSnapshot),
    );

    return this.transformedSnapshot(role, {
      name,
      ...attributes,
      options:
        this.includeComboboxOptions && transformedOptions.length > 0
          ? transformedOptions
          : undefined,
    });
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

  private removeUndefinedProperties(
    attributes: Record<string, unknown>,
  ): Record<string, unknown> {
    const sparseAttributes: Record<string, unknown> = {};

    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        sparseAttributes[key] = value;
      }
    });

    return sparseAttributes;
  }

  private transformedSnapshot(role: ElementRole, content: unknown): unknown {
    return { [role]: content };
  }
}
