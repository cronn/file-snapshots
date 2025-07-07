import type { InputRole } from "./input";
import type { ElementRole, SnapshotTargetElement } from "./types";

type ElementRoleResolver<TRoles = ElementRole> =
  | TRoles
  | ((element: SnapshotTargetElement) => TRoles);

const ELEMENT_ROLES: Record<string, ElementRoleResolver> = {
  main: "main",
  nav: "navigation",
  form: "form",
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
  textarea: resolveInputRole,
  select: resolveInputRole,
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
  const elementRole = element.getAttribute("role");
  if (elementRole !== null) {
    return elementRole as ElementRole;
  }

  const nodeType = element.nodeName.toLowerCase();
  const roleResolver = ELEMENT_ROLES[nodeType];
  if (roleResolver === undefined) {
    return undefined;
  }

  if (typeof roleResolver === "string") {
    return roleResolver;
  }

  return roleResolver(element);
}

export function resolveInputRole(
  element: SnapshotTargetElement,
): InputRole | "button" {
  if (element instanceof HTMLTextAreaElement) {
    return "textbox";
  }

  if (element instanceof HTMLSelectElement) {
    return "combobox";
  }

  const inputRole = element.getAttribute("type") ?? "text";
  const roleResolver = INPUT_ROLES[inputRole];

  if (roleResolver === undefined) {
    return "textbox";
  }

  if (typeof roleResolver === "string") {
    return roleResolver;
  }

  return roleResolver(element);
}
