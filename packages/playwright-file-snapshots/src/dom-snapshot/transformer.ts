/// <reference types="@cronn/dom-snapshot" />

interface NormalizedElementSnapshot {
  role: ElementRole;
  name?: string;
  attributes?: Record<string, unknown>;
  children?: Array<unknown>;
}

export class DomSnapshotTransformer {
  public transform(snapshots: Array<NodeSnapshot>): unknown {
    const transformedSnapshots = snapshots.map((snapshot) =>
      this.transformSnapshotRecursive(snapshot),
    );

    if (transformedSnapshots.length === 1) {
      return transformedSnapshots.at(0);
    }

    return transformedSnapshots;
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
    if (snapshot.role === "combobox") {
      return this.simplifyComboboxSnapshot(snapshot);
    }

    const normalizedSnapshot = this.normalizeElementSnapshot(snapshot);

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
    const transformedChildren = snapshot.children?.map((childSnaphot) =>
      this.transformSnapshotRecursive(childSnaphot),
    );

    const nameEqualsChildren =
      transformedChildren !== undefined &&
      transformedChildren.length === 1 &&
      snapshot.name === transformedChildren.at(0);

    return {
      role: snapshot.role,
      name: snapshot.name,
      attributes: sparseAttributes,
      children: nameEqualsChildren ? undefined : transformedChildren,
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
      options: transformedOptions.length > 0 ? transformedOptions : undefined,
    });
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
