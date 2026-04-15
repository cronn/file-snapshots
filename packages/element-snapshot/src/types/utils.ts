export type SetValues<TSet> = TSet extends Set<infer TValue> ? TValue : never;
