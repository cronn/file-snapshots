import type { Normalizer } from "../types/normalizer";

/**
 * Returns a normalizer that replaces every occurrence of `searchValue` with `maskedValue`.
 *
 * @param searchValue The value to be masked
 * @param maskedValue The masked value to replace the `searchValue` with
 *
 * @example maskString("https://example.com", "<BASE_URL>")
 */
export function maskString(
  searchValue: string,
  maskedValue: string,
): Normalizer<string> {
  return function normalizer(value: string): string {
    return value.replaceAll(searchValue, maskedValue);
  };
}
