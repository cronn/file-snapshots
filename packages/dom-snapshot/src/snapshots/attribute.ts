import type { SnapshotTargetElement } from "./types";

export function stringAttribute(value: string | null): string | undefined {
  return value !== null && value !== "" ? value : undefined;
}

export function booleanAttribute(
  value: boolean | string | null,
): true | undefined {
  return value === true || value === "true" ? true : undefined;
}

export function numericAttribute(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  try {
    return parseInt(value);
  } catch {
    return undefined;
  }
}

export function resolveElementReference(
  element: SnapshotTargetElement,
  attributeName: string,
): HTMLElement | null {
  const referenceId = element.getAttribute(attributeName);
  if (referenceId === null) {
    return null;
  }

  return element.ownerDocument.getElementById(referenceId);
}
