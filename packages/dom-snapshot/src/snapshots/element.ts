import { booleanAttribute } from "./attribute";
import { snapshotButton } from "./button";
import { snapshotChildren } from "./children";
import { snapshotCombobox, snapshotOption } from "./combobox";
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

type NonContainerElementRole = Exclude<ElementRole, ContainerRole>;

const ROLE_SNAPSHOTS: Record<NonContainerElementRole, ElementSnapshotFn> = {
  button: snapshotButton,
  checkbox: snapshotInput,
  combobox: snapshotCombobox,
  option: snapshotOption,
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

  const ariaHidden = booleanAttribute(node.ariaHidden);
  if (ariaHidden === true) {
    return null;
  }

  const elementRole = resolveElementRole(node);

  if (elementRole === undefined) {
    return snapshotChildren(node) ?? null;
  }

  if (hasRoleSpecificSnapshot(elementRole)) {
    const snapshotByRole = ROLE_SNAPSHOTS[elementRole];
    return snapshotByRole(node);
  }

  return snapshotContainer(elementRole, node);
}

export function hasRoleSpecificSnapshot(
  role: string,
): role is NonContainerElementRole {
  return role in ROLE_SNAPSHOTS;
}
