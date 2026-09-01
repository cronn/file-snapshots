import type { ElementRole } from "../types/role";
import type { GenericElementSnapshot, NodeSnapshot } from "../types/snapshot";
import type {
  SnapshotTransformer,
  SnapshotTransformerContext,
} from "../types/transformer";
import { isEmpty } from "../utils/guards";

interface NormalizedElementSnapshot {
  role: ElementRole;
  name: string;
  attributes: Record<string, unknown>;
  children: Array<unknown>;
}

export function semanticSnapshotTransformer(
  snapshot: NodeSnapshot,
  context: SnapshotTransformerContext,
): unknown {
  if (snapshot.role === "text") {
    return snapshot.name;
  }

  return transformElementSnapshot(snapshot, context.transform);
}

export function transformElementSnapshot(
  snapshot: GenericElementSnapshot,
  transformRecursive: SnapshotTransformer,
): unknown {
  const normalizedSnapshot = normalizeElementSnapshot(
    snapshot,
    transformRecursive,
  );

  if (hasOnlyRole(normalizedSnapshot)) {
    const { role } = normalizedSnapshot;
    return transformedSnapshot(role, "");
  }

  if (hasOnlyName(normalizedSnapshot)) {
    const { role, name } = normalizedSnapshot;
    return transformedSnapshot(role, name);
  }

  if (hasOnlyChildren(normalizedSnapshot)) {
    const { role, children } = normalizedSnapshot;
    return transformedSnapshot(
      role,
      children.length === 1 ? children.at(0) : children,
    );
  }

  const { role, name, attributes, children } = normalizedSnapshot;
  return transformedSnapshot(role, name, {
    ...attributes,
    children: children.length === 0 ? undefined : children,
  });
}

function normalizeElementSnapshot(
  snapshot: GenericElementSnapshot,
  transformRecursive: SnapshotTransformer,
): NormalizedElementSnapshot {
  const normalizedName = snapshot.name ?? "";
  const transformedAttributes = transformAttributes(snapshot.attributes ?? {});
  const transformedChildren = (snapshot.children ?? []).map(transformRecursive);
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

function hasOnlyRole(snapshot: NormalizedElementSnapshot): boolean {
  return (
    isEmpty(snapshot.name) &&
    isEmpty(snapshot.attributes) &&
    isEmpty(snapshot.children)
  );
}

function hasOnlyName(snapshot: NormalizedElementSnapshot): boolean {
  return (
    !isEmpty(snapshot.name) &&
    isEmpty(snapshot.attributes) &&
    isEmpty(snapshot.children)
  );
}

function hasOnlyChildren(snapshot: NormalizedElementSnapshot): boolean {
  return (
    isEmpty(snapshot.name) &&
    isEmpty(snapshot.attributes) &&
    !isEmpty(snapshot.children)
  );
}

function transformAttributes(attributes: object): Record<string, unknown> {
  const filteredAttributes: Record<string, unknown> = {};

  Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
    if (attributeValue === undefined) {
      return;
    }

    filteredAttributes[attributeName] = attributeValue;
  });

  return filteredAttributes;
}

function transformedSnapshot(
  role: ElementRole,
  nameOrContent: unknown,
  additionalProperties?: Record<string, unknown>,
): unknown {
  return { [role]: nameOrContent, ...additionalProperties };
}
