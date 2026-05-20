export type Normalizer<TValue> = (value: TValue) => TValue;

export type NormalizerWithContext<TValue, TContext> = (
  value: TValue,
  context: TContext,
) => TValue;
