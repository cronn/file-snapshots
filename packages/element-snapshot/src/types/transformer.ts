import type { NodeRole, NodeSnapshot, SnapshotByRole } from "./snapshot";

export type SnapshotTransformer = (snapshot: NodeSnapshot) => unknown;

export type RoleBasedSnapshotTransformer<TRole extends NodeRole = NodeRole> = (
  snapshot: SnapshotByRole<TRole>,
  context: SnapshotTransformerContext,
) => unknown;

export type DefaultSnapshotTransformer = (
  snapshot: NodeSnapshot,
  context: SnapshotTransformerContext,
) => unknown;

export interface SnapshotTransformerContext {
  transform: SnapshotTransformer;
}

export type RoleBasedSnapshotTransformers = {
  [TRole in NodeRole]?: RoleBasedSnapshotTransformer<TRole>;
};
