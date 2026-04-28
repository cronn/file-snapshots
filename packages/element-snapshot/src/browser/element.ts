import type { ContainerRole } from "../types/elements/container";
import type { ElementRole } from "../types/role";
import type { ElementSnapshot, NodeSnapshot } from "../types/snapshot";

import { booleanAttribute } from "./attribute";
import { snapshotButton } from "./button";
import { snapshotChildren } from "./children";
import { snapshotCombobox, snapshotOption } from "./combobox";
import { snapshotContainer } from "./container";
import { snapshotDialogWithRole } from "./dialog";
import { snapshotGroup, snapshotRadioGroup } from "./group";
import { snapshotHeading } from "./heading";
import { snapshotImage } from "./image";
import { snapshotInput } from "./input";
import { snapshotLink } from "./link";
import { snapshotMenuitem } from "./list";
import { snapshotProgressbar } from "./progressbar";
import { snapshotRegion } from "./region";
import { parseElementRole } from "./role";
import { snapshotSeparator } from "./separator";
import { snapshotTab } from "./tab";
import { snapshotColumnHeader } from "./table";
import { snapshotTextNode } from "./text";
import type { SnapshotTargetElement, SnapshotTargetNode } from "./types";
import { getElementTagName } from "./utils";

type ElementSnapshotFn = (
  node: SnapshotTargetElement,
) => ElementSnapshot | Array<NodeSnapshot> | null;

type NonContainerElementRole = Exclude<ElementRole, ContainerRole>;

const ROLE_SNAPSHOTS: Record<NonContainerElementRole, ElementSnapshotFn> = {
  alertdialog: snapshotDialogWithRole("alertdialog"),
  button: snapshotButton,
  checkbox: snapshotInput,
  columnheader: snapshotColumnHeader,
  combobox: snapshotCombobox,
  dialog: snapshotDialogWithRole("dialog"),
  group: snapshotGroup,
  heading: snapshotHeading,
  img: snapshotImage,
  menuitem: snapshotMenuitem,
  option: snapshotOption,
  progressbar: snapshotProgressbar,
  link: snapshotLink,
  radio: snapshotInput,
  radiogroup: snapshotRadioGroup,
  region: snapshotRegion,
  searchbox: snapshotInput,
  separator: snapshotSeparator,
  slider: snapshotInput,
  spinbutton: snapshotInput,
  tab: snapshotTab,
  textbox: snapshotInput,
};

export function snapshotElement(
  element: SnapshotTargetElement,
): Array<NodeSnapshot> {
  return snapshotNodeRecursive(element);
}

export function snapshotNodeRecursive(
  node: SnapshotTargetNode,
  excludedNodes: Array<Node> = [],
): Array<NodeSnapshot> {
  const snapshot = snapshotNodeByType(node, excludedNodes);

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
  excludedNodes: Array<Node>,
): NodeSnapshot | Array<NodeSnapshot> | null {
  if (excludedNodes.includes(node)) {
    return null;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    return snapshotTextNode(node);
  }

  if (!isSupportedElement(node) || isHiddenElement(node)) {
    return null;
  }

  const elementRole = parseElementRole(node);

  if (elementRole === undefined) {
    return snapshotChildren(node, excludedNodes) ?? null;
  }

  if (hasRoleSpecificSnapshot(elementRole)) {
    const snapshotByRole = ROLE_SNAPSHOTS[elementRole];
    return snapshotByRole(node);
  }

  return snapshotContainer(elementRole, node);
}

const UNSUPPORTED_ELEMENTS = new Set([
  "audio",
  "figure",
  "noscript",
  "picture",
  "script",
  "style",
  "template",
  "video",
]);

function isSupportedElement(
  node: SnapshotTargetNode,
): node is SnapshotTargetElement {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return false;
  }

  const tagName = getElementTagName(node);
  return !UNSUPPORTED_ELEMENTS.has(tagName);
}

export function hasRoleSpecificSnapshot(
  role: string,
): role is NonContainerElementRole {
  return role in ROLE_SNAPSHOTS;
}

// inspired by https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobevisible
function isHiddenElement(element: SnapshotTargetElement): boolean {
  if (element.hasAttribute("hidden")) {
    return true;
  }

  const ariaHidden = booleanAttribute(element.ariaHidden);
  if (ariaHidden === true) {
    return true;
  }

  // do not treat elements with "opacity: 0" as hidden, because they are visible to screen readers
  const cssStyles = window.getComputedStyle(element);
  return (
    cssStyles.display === "none" ||
    cssStyles.visibility === "hidden" ||
    cssStyles.visibility === "collapse"
  );
}
