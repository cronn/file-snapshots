import type { Normalizer } from "../types/normalizer";
import { isString } from "../utils/guards";

/**
 * Creates a guarded normalizer that only applies the given normalizer if the value is a string
 *
 * @example stringNormalizer((value) => value.trim())
 */
export function stringNormalizer<TValue>(
  normalizer: Normalizer<string>,
): Normalizer<TValue> {
  return guardedNormalizers(isString, normalizer) as Normalizer<TValue>;
}

function guardedNormalizers<TValue, TGuardedValue extends TValue>(
  guard: (value: TValue) => value is TGuardedValue,
  normalizer: (value: TGuardedValue) => TGuardedValue,
): Normalizer<TValue> {
  return function conditionalNormalizer(value: TValue): TValue {
    if (!guard(value)) {
      return value;
    }

    return normalizer(value);
  };
}
