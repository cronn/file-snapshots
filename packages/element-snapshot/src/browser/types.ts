export type SnapshotTargetNode = SnapshotTargetElement | ChildNode;

export type SnapshotTargetElement = HTMLElement | SVGElement;

export type ElementTagName = keyof HTMLElementTagNameMap | "svg";
