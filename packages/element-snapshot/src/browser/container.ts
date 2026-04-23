import type {
  ContainerRole,
  ContainerSnapshot,
} from "../types/elements/container";
import { CONTAINER_ROLES } from "../types/elements/container";
import { elementSnapshot } from "../utils/factories";

import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

export function snapshotContainer(
  role: ContainerRole,
  element: SnapshotTargetElement,
): ContainerSnapshot {
  const children = snapshotChildren(element);

  return elementSnapshot({
    role,
    name: resolveAccessibleName(element),
    children,
  });
}

export function isContainerRole(role: string): role is ContainerRole {
  return (CONTAINER_ROLES as Set<string>).has(role);
}
