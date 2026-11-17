import type { CommonInputRole, InputRole } from "../types/elements/input";
import type { ElementRole } from "../types/role";

import { isContainerRole } from "./container";
import { hasRoleSpecificSnapshot } from "./element";
import { roleSelector, selectorList } from "./selector";
import type { ElementTagName, SnapshotTargetElement } from "./types";
import { getElementTagName, isWithinElement } from "./utils";

type ElementRoleResolver<TRoles = ElementRole> =
  | TRoles
  | ((element: SnapshotTargetElement) => TRoles | undefined);

type ElementContextValidator = (
  element: SnapshotTargetElement,
  role: ElementRole,
) => boolean;

const ELEMENT_ROLES: Partial<Record<ElementTagName, ElementRoleResolver>> = {
  a: "link",
  article: "article",
  aside: "complementary",
  blockquote: "blockquote",
  button: "button",
  code: "code",
  dd: "definition",
  del: "deletion",
  details: "group",
  dl: "descriptionlist",
  dt: "term",
  em: "emphasis",
  fieldset: "group",
  footer: "contentinfo",
  form: "form",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  header: "banner",
  hr: "separator",
  img: "img",
  input: resolveInputRole,
  ins: "insertion",
  label: "label",
  legend: "label",
  li: "listitem",
  main: "main",
  mark: "mark",
  nav: "navigation",
  ol: "list",
  option: "option",
  output: "status",
  p: "paragraph",
  progress: "progressbar",
  search: "search",
  section: "region",
  select: resolveSelectRole,
  strong: "strong",
  sub: "subscript",
  sup: "superscript",
  table: "table",
  tbody: "rowgroup",
  textarea: "textbox",
  td: "cell",
  tfoot: "rowgroup",
  th: resolveTableHeaderCellRole,
  thead: "rowgroup",
  tr: "row",
  ul: "list",
};

const CONTEXT_DEPENDENT_ROLES: Partial<
  Record<ElementRole, ElementContextValidator>
> = {
  banner: isTopLevelBanner,
  cell: isWithinTableRow,
  columnheader: isWithinTableRowOrGridRow,
  definition: isWithinDescriptionList,
  gridcell: isWithinGridRow,
  listitem: isWithinList,
  menuitem: isWithinMenu,
  row: isWithinTableOrGrid,
  rowgroup: isWithinTableOrGrid,
  rowheader: isWithinTableRowOrGridRow,
  tab: isWithinTablist,
  term: isWithinDescriptionList,
  treeitem: isWithinTree,
};

const INPUT_ROLES: Record<string, CommonInputRole | "button"> = {
  button: "button",
  checkbox: "checkbox",
  email: "textbox",
  image: "button",
  number: "spinbutton",
  radio: "radio",
  range: "slider",
  reset: "button",
  search: "searchbox",
  submit: "button",
  tel: "textbox",
  text: "textbox",
  url: "textbox",
};

const COMBOBOX_INPUT_TYPES = new Set(["email", "search", "tel", "text", "url"]);

export function parseElementRole(
  element: SnapshotTargetElement,
): ElementRole | undefined {
  const resolvedElementRole = resolveElementRole(element);
  if (resolvedElementRole === undefined) {
    return undefined;
  }

  const isValidInContext = CONTEXT_DEPENDENT_ROLES[resolvedElementRole];
  if (
    isValidInContext !== undefined &&
    !isValidInContext(element, resolvedElementRole)
  ) {
    return undefined;
  }

  return resolvedElementRole;
}

function resolveElementRole(
  element: SnapshotTargetElement,
): ElementRole | undefined {
  const explicitRole = element.role;
  if (isIgnoredRole(explicitRole)) {
    return undefined;
  }

  if (
    explicitRole !== null &&
    (hasRoleSpecificSnapshot(explicitRole) || isContainerRole(explicitRole))
  ) {
    return explicitRole;
  }

  const tagName = getElementTagName(element);
  const roleResolver = ELEMENT_ROLES[tagName];
  if (roleResolver === undefined) {
    return undefined;
  }

  if (typeof roleResolver === "string") {
    return roleResolver;
  }

  return roleResolver(element);
}

function isIgnoredRole(role: string | null): boolean {
  return role === "presentation" || role === "none";
}

export function resolveInputRole(
  element: SnapshotTargetElement,
): InputRole | undefined {
  if (!(element instanceof HTMLInputElement)) {
    return undefined;
  }

  // See https://www.w3.org/TR/html-aam-1.0/#el-input-text-list
  if (COMBOBOX_INPUT_TYPES.has(element.type) && element.list !== null) {
    return "combobox";
  }

  return INPUT_ROLES[element.type] ?? "textbox";
}

export function resolveSelectRole(
  element: SnapshotTargetElement,
): "combobox" | "listbox" | undefined {
  if (!(element instanceof HTMLSelectElement)) {
    return undefined;
  }

  // See https://www.w3.org/TR/html-aam-1.0/#el-select-listbox
  if (element.multiple || element.size > 1) {
    return "listbox";
  }

  return "combobox";
}

const DISALLOWED_BANNER_CONTAINER_ELEMENTS = [
  "article",
  "aside",
  "main",
  "nav",
  "section",
] as const;
const DISALLOWED_BANNER_CONTAINER_ROLES = [
  "article",
  "complementary",
  "main",
  "navigation",
  "region",
] as const;
const DISALLOWED_BANNER_CONTAINER_SELECTOR = selectorList(
  ...DISALLOWED_BANNER_CONTAINER_ELEMENTS,
  ...DISALLOWED_BANNER_CONTAINER_ROLES.map(roleSelector),
);

function isTopLevelBanner(element: SnapshotTargetElement): boolean {
  return !isWithinElement(element, DISALLOWED_BANNER_CONTAINER_SELECTOR);
}

function isWithinDescriptionList(element: SnapshotTargetElement): boolean {
  return isWithinElement(element, "dl");
}

function resolveTableHeaderCellRole(
  element: SnapshotTargetElement,
): "columnheader" | "rowheader" | undefined {
  if (!(element instanceof HTMLTableCellElement)) {
    return undefined;
  }

  const scope = element.scope;

  switch (scope) {
    case "col":
    case "colgroup":
      return "columnheader";
    case "row":
    case "rowgroup":
      return "rowheader";
    default:
      return resolveTableHeaderCellRoleFromContext(element);
  }
}

function resolveTableHeaderCellRoleFromContext(
  element: HTMLTableCellElement,
): "columnheader" | "rowheader" | undefined {
  const row = element.parentElement;
  if (!(row instanceof HTMLTableRowElement)) {
    return undefined;
  }

  const nextCell = row.cells[element.cellIndex + 1] ?? null;

  if (
    row.rowIndex === 0 &&
    (nextCell === null || resolveElementRole(nextCell) === "columnheader")
  ) {
    return "columnheader";
  }

  if (
    element.cellIndex === 0 &&
    nextCell !== null &&
    resolveElementRole(nextCell) === "cell"
  ) {
    return "rowheader";
  }

  return undefined;
}

const TABLE_SELECTOR = selectorList("table", roleSelector("table"));
const GRID_SELECTOR = roleSelector("grid");
const ROW_SELECTOR = selectorList("tr", roleSelector("row"));
const LIST_SELECTOR = selectorList("ul", "ol", roleSelector("list"));

function isWithinTableOrGrid(element: Element): boolean {
  return isWithinTable(element) || isWithinGrid(element);
}

function isWithinTable(element: Element): boolean {
  return isWithinElement(element, TABLE_SELECTOR);
}

function isWithinGrid(element: Element): boolean {
  return isWithinElement(element, GRID_SELECTOR);
}

function isWithinTableRowOrGridRow(element: Element): boolean {
  const closestRow = element.closest(ROW_SELECTOR);
  return closestRow !== null && isWithinTableOrGrid(closestRow);
}

function isWithinTableRow(element: Element): boolean {
  const closestRow = element.closest(ROW_SELECTOR);
  return closestRow !== null && isWithinTable(closestRow);
}

function isWithinGridRow(element: Element): boolean {
  const closestRow = element.closest(ROW_SELECTOR);
  return closestRow !== null && isWithinGrid(closestRow);
}

function isWithinList(element: SnapshotTargetElement): boolean {
  return isWithinElement(element, LIST_SELECTOR);
}

function isWithinMenu(element: SnapshotTargetElement): boolean {
  return isWithinElement(element, roleSelector("menu"));
}

function isWithinTablist(element: SnapshotTargetElement): boolean {
  return isWithinElement(element, roleSelector("tablist"));
}

function isWithinTree(element: SnapshotTargetElement): boolean {
  return isWithinElement(element, roleSelector("tree"));
}
