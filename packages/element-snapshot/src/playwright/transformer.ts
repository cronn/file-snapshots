import type { ComboboxSnapshot } from "../browser/combobox";
import type { TextSnapshot } from "../browser/text";
import type {
  ElementRole,
  ElementSnapshot,
  NodeSnapshot,
} from "../browser/types";

interface NormalizedElementSnapshot {
  role: ElementRole;
  name?: string;
  attributes?: Record<string, unknown>;
  children?: Array<unknown>;
}

interface DomSnapshotTransformerOptions {
  filter?: SnapshotFilter;
  includeComboboxOptions?: boolean;
}

export type SnapshotFilter = (node: NodeSnapshot) => boolean;

export class ElementSnapshotTransformer {
  private readonly filter: SnapshotFilter;
  private readonly includeComboboxOptions: boolean;

  public constructor(options: DomSnapshotTransformerOptions = {}) {
    this.filter = options.filter ?? (() => true);
    this.includeComboboxOptions = options.includeComboboxOptions ?? false;
  }

  public transform(snapshots: Array<NodeSnapshot>): unknown {
    const transformedSnapshots = this.filterAndTransformSnapshots(snapshots);

    if (transformedSnapshots.length === 1) {
      return transformedSnapshots.at(0);
    }

    return transformedSnapshots;
  }

  private filterAndTransformSnapshots(
    snapshots: Array<NodeSnapshot>,
  ): Array<unknown> {
    return snapshots.flatMap((snapshot) => {
      if (this.filter(snapshot)) {
        return this.transformSnapshotRecursive(snapshot);
      }

      if ("children" in snapshot) {
        return this.filterAndTransformSnapshots(snapshot.children ?? []);
      }

      return [];
    });
  }

  private transformSnapshotRecursive(snapshot: NodeSnapshot): unknown {
    if (snapshot.role === "text") {
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
      name,
      ...attributes,
      children,
    });
  }

  private normalizeElementSnapshot(
    snapshot: ElementSnapshot,
  ): NormalizedElementSnapshot {
    const sparseAttributes = this.removeUndefinedProperties(
      (snapshot.attributes ?? {}) as Record<string, unknown>,
    );
    const transformedChildren = this.filterAndTransformSnapshots(
      snapshot?.children ?? [],
    );

    const nameEqualsChildren =
      transformedChildren.length === 1 &&
      snapshot.name === transformedChildren.at(0);

    return {
      role: snapshot.role,
      name: snapshot.name,
      attributes: sparseAttributes,
      children: nameEqualsChildren
        ? undefined
        : transformedChildren.length === 0
          ? undefined
          : transformedChildren,
    };
  }

  private simplifyComboboxSnapshot(snapshot: ComboboxSnapshot): unknown {
    const { role, name, attributes } = this.normalizeElementSnapshot(snapshot);
    const options = snapshot.options ?? [];
    const transformedOptions = options.map((optionSnapshot) =>
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
      snapshot.name === undefined &&
      (snapshot.attributes === undefined ||
        Object.keys(snapshot.attributes).length === 0) &&
      (snapshot.children === undefined || snapshot.children.length === 0)
    );
  }

  private hasOnlyName(
    snapshot: NormalizedElementSnapshot,
  ): snapshot is { role: ElementRole; name: string } {
    return (
      snapshot.name !== undefined &&
      snapshot.attributes === undefined &&
      snapshot.children === undefined
    );
  }

  private hasOnlyChildren(
    snapshot: NormalizedElementSnapshot,
  ): snapshot is { role: ElementRole; children: Array<NodeSnapshot> } {
    return (
      snapshot.name === undefined &&
      snapshot.attributes === undefined &&
      snapshot.children !== undefined
    );
  }

  private removeUndefinedProperties(
    attributes: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    const sparseAttributes: Record<string, unknown> = {};

    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        sparseAttributes[key] = value;
      }
    });

    return Object.keys(sparseAttributes).length > 0
      ? sparseAttributes
      : undefined;
  }

  private transformedSnapshot(role: ElementRole, content: unknown): unknown {
    return { [role]: content };
  }
}
