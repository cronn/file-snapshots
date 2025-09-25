import { isContainerRole } from "./container";
import { hasRoleSpecificSnapshot } from "./element";
import type { InputRole } from "./input";
import { resolveAccessibleName } from "./name";
import { roleSelector, selectorList } from "./selector";
import type {
  ElementRole,
  ElementTagName,
  SnapshotTargetElement,
} from "./types";
import { getElementTagName } from "./utils";

type ElementRoleResolver<TRoles = ElementRole> =
  | TRoles
  | ((element: SnapshotTargetElement) => TRoles | undefined);

type ElementContextValidator = (element: SnapshotTargetElement) => boolean;

const ELEMENT_ROLES: Partial<Record<ElementTagName, ElementRoleResolver>> = {
  main: "main",
  nav: "navigation",
  form: "form",
  header: "banner",
  section: "region",
  article: "article",
  aside: "complementary",
  search: "search",
  footer: "contentinfo",
  p: "paragraph",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  ul: "list",
  ol: "list",
  li: "listitem",
  a: "link",
  button: "button",
  input: resolveInputRole,
  textarea: "textbox",
  select: "combobox",
  option: "option",
  dt: "term",
  dd: "definition",
  table: "table",
  thead: "rowgroup",
  tbody: "rowgroup",
  tfoot: "rowgroup",
  tr: "row",
  th: resolveTableHeaderCellRole,
  td: "cell",
};

const CONTEXT_DEPENDENT_ROLES: Partial<
  Record<ElementRole, ElementContextValidator>
> = {
  banner: isTopLevelBanner,
  region: hasAccessibleName,
  term: isWithinDescriptionList,
  definition: isWithinDescriptionList,
  listitem: isWithinList,
  rowgroup: isWithinTableOrGrid,
  row: isWithinTableOrGrid,
  columnheader: isWithinTableRowOrGridRow,
  rowheader: isWithinTableRowOrGridRow,
  cell: isWithinTableRow,
  gridcell: isWithinGridRow,
};

const INPUT_ROLES: Record<string, ElementRoleResolver<InputRole | "button">> = {
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
  tel: "searchbox",
  text: "textbox",
  url: "textbox",
};

export function parseElementRole(
  element: SnapshotTargetElement,
): ElementRole | undefined {
  const resolvedElementRole = resolveElementRole(element);
  if (resolvedElementRole === undefined) {
    return undefined;
  }

  const isValidInContext = CONTEXT_DEPENDENT_ROLES[resolvedElementRole];
  if (isValidInContext !== undefined && !isValidInContext(element)) {
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

  const roleResolver = INPUT_ROLES[element.type];

  if (roleResolver === undefined) {
    return "textbox";
  }

  if (typeof roleResolver === "string") {
    return roleResolver;
  }

  return roleResolver(element);
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

function isTopLevelBanner(element: SnapshotTargetElement): boolean {
  const disallowedContainerSelector = selectorList(
    ...DISALLOWED_BANNER_CONTAINER_ELEMENTS,
    ...DISALLOWED_BANNER_CONTAINER_ROLES.map(roleSelector),
  );
  const closestDisallowedContainer = element.closest(
    disallowedContainerSelector,
  );
  return closestDisallowedContainer === null;
}

function hasAccessibleName(element: SnapshotTargetElement): boolean {
  const accessibleName = resolveAccessibleName(element, false);
  return accessibleName !== undefined;
}

function isWithinDescriptionList(element: SnapshotTargetElement): boolean {
  const closestDescriptionList = element.closest("dl");
  return closestDescriptionList !== null;
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
      return "columnheader";
    case "row":
      return "rowheader";
    default:
      return undefined;
  }
}

function isWithinTableOrGrid(element: Element): boolean {
  return isWithinTable(element) || isWithinGrid(element);
}

function isWithinTable(element: Element): boolean {
  const closestTable = element.closest(
    selectorList("table", roleSelector("table")),
  );
  return closestTable !== null;
}

function isWithinGrid(element: Element): boolean {
  const closestGrid = element.closest(roleSelector("grid"));
  return closestGrid !== null;
}

function isWithinTableRowOrGridRow(element: Element): boolean {
  return isWithinTableRow(element) || isWithinGridRow(element);
}

function isWithinTableRow(element: Element): boolean {
  const closestRow = element.closest(selectorList("tr", roleSelector("row")));
  return closestRow !== null && isWithinTable(closestRow);
}

function isWithinGridRow(element: Element): boolean {
  const closestRow = element.closest(selectorList("tr", roleSelector("row")));
  return closestRow !== null && isWithinGrid(closestRow);
}

function isWithinList(element: SnapshotTargetElement): boolean {
  const closestList = element.closest(
    selectorList("ul", "ol", roleSelector("list")),
  );
  return closestList !== null;
}
