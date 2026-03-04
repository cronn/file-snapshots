import type { TextSnapshot } from "../browser/text";
import type {
  ElementRole,
  GenericElementSnapshot,
  NodeSnapshot,
} from "../browser/types";

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
