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

  const parsedValue = parseInt(value);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

export function enumAttribute<TEnum extends string>(
  value: string | null,
  supportedValues: Set<TEnum>,
): TEnum | undefined {
  if (value === null || !(supportedValues as Set<string>).has(value)) {
    return undefined;
  }

  return value as TEnum;
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
