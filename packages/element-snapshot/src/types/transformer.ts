import type { ElementRole } from "./role";
import type { NodeRole, NodeSnapshot, SnapshotByRole } from "./snapshot";

/**
 * A snapshot that can be passed to the default transformation
 *
 * Accepts snapshots assembled by a transformer, whose attribute values may
 * already be transformed.
 */
export interface TransformableElementSnapshot {
  role: ElementRole;
  name?: string;
  attributes?: Record<string, unknown>;
  children?: Array<NodeSnapshot>;
}

export type TransformableSnapshot = NodeSnapshot | TransformableElementSnapshot;

/**
 * Applies the default transformation to a snapshot and its descendants
 *
 * Transformers registered for descendant roles are still applied. The
 * transformer of the passed snapshot itself is skipped, so calling this from
 * within a transformer can never recurse infinitely.
 */
export type SnapshotTransform = (snapshot: TransformableSnapshot) => unknown;

/**
 * Replaces the default transformation for a single role
 *
 * Applied after filtering and before the default serialization. The returned
 * value is written to the snapshot verbatim, so it must be JSON-serializable.
 */
export type SnapshotTransformer<TRole extends NodeRole = NodeRole> = (
  snapshot: SnapshotByRole<TRole>,
  context: SnapshotTransformerContext,
) => unknown;

export interface SnapshotTransformerContext {
  transform: SnapshotTransform;
}

/**
 * Transformers to apply, keyed by role
 */
export type SnapshotTransformers = {
  [TRole in NodeRole]?: SnapshotTransformer<TRole>;
};
