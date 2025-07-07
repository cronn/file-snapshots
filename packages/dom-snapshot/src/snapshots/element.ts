import { snapshotButton } from "./button";
import { snapshotChildren } from "./children";
import type { ContainerRole } from "./container";
import { snapshotContainer } from "./container";
import { snapshotHeading } from "./heading";
import { snapshotInput } from "./input";
import { snapshotLink } from "./link";
import { resolveElementRole } from "./role";
import { snapshotTextNode } from "./text";
import type {
  ElementRole,
  ElementSnapshot,
  NodeSnapshot,
  SnapshotTargetElement,
  SnapshotTargetNode,
} from "./types";

type ElementSnapshotFn = (
  node: SnapshotTargetElement,
) => ElementSnapshot | null;

type NonContainerElementType = Exclude<ElementRole, ContainerRole>;

const ELEMENT_SNAPSHOTS: Record<NonContainerElementType, ElementSnapshotFn> = {
  button: snapshotButton,
  checkbox: snapshotInput,
  combobox: snapshotInput,
  heading: snapshotHeading,
  link: snapshotLink,
  radio: snapshotInput,
  searchbox: snapshotInput,
  slider: snapshotInput,
  spinbutton: snapshotInput,
  textbox: snapshotInput,
};

export function snapshotElement(
  element: SnapshotTargetElement,
): Array<NodeSnapshot> {
  return snapshotNodeRecursive(element);
}

export function snapshotNodeRecursive(
  node: SnapshotTargetNode,
): Array<NodeSnapshot> {
  const snapshot = snapshotNodeByType(node);

  if (snapshot === null) {
    return [];
  }

  if (Array.isArray(snapshot)) {
    return snapshot;
  }

  return [snapshot];
}

function snapshotNodeByType(
  node: SnapshotTargetNode,
): NodeSnapshot | Array<NodeSnapshot> | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return snapshotTextNode(node);
  }

  if (!(node instanceof HTMLElement)) {
    return null;
  }

  const elementType = resolveElementRole(node);

  if (elementType === undefined) {
    return snapshotChildren(node) ?? null;
  }

  if (isNonContainerElement(elementType)) {
    const snapshotByType = ELEMENT_SNAPSHOTS[elementType];
    return snapshotByType(node);
  }

  return snapshotContainer(elementType, node);
}

function isNonContainerElement(
  type: ElementRole,
): type is NonContainerElementType {
  return type in ELEMENT_SNAPSHOTS;
}
