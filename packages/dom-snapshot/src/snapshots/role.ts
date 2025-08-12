import { isContainerRole } from "./container";
import { hasRoleSpecificSnapshot } from "./element";
import type { InputRole } from "./input";
import { resolveAccessibleName } from "./name";
import { roleSelector, selectorList } from "./selector";
import type { ElementRole, SnapshotTargetElement } from "./types";

type ElementTagName = keyof HTMLElementTagNameMap;

type ElementRoleResolver<TRoles = ElementRole> =
  | TRoles
  | ((element: SnapshotTargetElement) => TRoles | undefined);

const ELEMENT_ROLES: Partial<Record<ElementTagName, ElementRoleResolver>> = {
  main: "main",
  nav: "navigation",
  form: "form",
  header: resolveHeaderRole,
  section: resolveSectionRole,
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

export function resolveElementRole(
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

  const tagName = element.tagName.toLowerCase() as ElementTagName;
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

function resolveHeaderRole(
  element: SnapshotTargetElement,
): "banner" | undefined {
  const disallowedContainerSelector = selectorList(
    ...DISALLOWED_BANNER_CONTAINER_ELEMENTS,
    ...DISALLOWED_BANNER_CONTAINER_ROLES.map(roleSelector),
  );
  const closestDisallowedContainer = element.closest(
    disallowedContainerSelector,
  );
  return closestDisallowedContainer === null ? "banner" : undefined;
}

function resolveSectionRole(
  element: SnapshotTargetElement,
): "region" | undefined {
  const accessibleName = resolveAccessibleName(element, false);
  return accessibleName !== undefined ? "region" : undefined;
}
