import type {
  ContainerRole,
  ContainerSnapshot,
} from "../types/elements/container";
import { CONTAINER_ROLES } from "../types/elements/container";

import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

const NAMEABLE_CONTAINER_ROLES = new Set(["label"]);

export function snapshotContainer(
  role: ContainerRole,
  element: SnapshotTargetElement,
): ContainerSnapshot {
  const children = snapshotChildren(element);

  return {
    role,
    name: resolveAccessibleName(element, NAMEABLE_CONTAINER_ROLES.has(role)),
    attributes: {},
    children,
  };
}

export function isContainerRole(role: string): role is ContainerRole {
  return (CONTAINER_ROLES as Set<string>).has(role);
}
