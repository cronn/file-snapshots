import type { ElementRole } from "./types";

export function selectorList(...selectors: Array<string>): string {
  return selectors.join(",");
}

export function roleSelector(roleName: ElementRole): string {
  return attributeSelector("role", roleName);
}

function attributeSelector(name: string, value: string): string {
  return `[${name}='${value}']`;
}
