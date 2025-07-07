export function stringAttribute(value: string | null): string | undefined {
  return value !== null && value !== "" ? value : undefined;
}

export function booleanAttribute(
  value: string | null,
  enabledValue = "true",
): true | undefined {
  return value === enabledValue ? true : undefined;
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
