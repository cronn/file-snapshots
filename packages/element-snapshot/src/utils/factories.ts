import type { TextSnapshot } from "../types/elements/text";
import type { ElementRole } from "../types/role";
import type { GenericElementSnapshot, NodeSnapshot } from "../types/snapshot";

export function textSnapshot(name: string): TextSnapshot {
  return {
    role: "text",
    name,
  };
}

interface ElementSnapshotValues<TRole> {
  role: TRole;
  name?: string;
  attributes?: Record<string, unknown>;
  children?: Array<NodeSnapshot>;
}

export function elementSnapshot<TRole extends ElementRole>(
  values: ElementSnapshotValues<TRole>,
): GenericElementSnapshot<TRole> {
  return {
    role: values.role,
    name: values.name,
    attributes: values.attributes ?? {},
    children: values.children ?? [],
  };
}
