import type { Normalizer } from "../types/normalizer";

/**
 * Returns a normalizer that finds every distinct match of `searchPattern` and replaces it with `maskValue(index)`
 *
 * @param searchPattern The pattern to be masked (requires global flag to find all matches)
 * @param maskValue The function returning the masked value to replace a matched value with
 *
 * @example maskPattern(/[\d{4}-\d{2}-\d{2}/g, (index) => `<DATE_${index}>`)
 */
export function maskPattern(
  searchPattern: RegExp,
  maskValue: (index: number) => string,
): Normalizer<string> {
  const distinctValues = new Set<string>();

  return function normalizer(value: string): string {
    let match: RegExpExecArray | null;

    while ((match = searchPattern.exec(value)) !== null) {
      const matchedValue = match[0];
      if (!distinctValues.has(matchedValue)) {
        distinctValues.add(matchedValue);
      }
    }

    let maskedValue = value;
    Array.from(distinctValues.values()).forEach((matchedValue, index) => {
      maskedValue = maskedValue.replaceAll(matchedValue, maskValue(index));
    });
    return maskedValue;
  };
}
