import type { NodeRole, NodeSnapshot } from "../browser/types";

export type SnapshotByRole<TRole extends NodeRole> = NodeSnapshot & {
  role: TRole;
};
