import type { SnapshotTransformer } from "../types/transformer";

export interface ComboboxTransformerOptions {
  /**
   * Include combobox options in the snapshot
   *
   * @default false
   */
  includeOptions?: boolean;
}

/**
 * Returns a transformer controlling whether the options of a combobox are
 * included in the snapshot
 *
 * Empty option lists are always omitted.
 */
export function comboboxTransformer(
  options: ComboboxTransformerOptions = {},
): SnapshotTransformer<"combobox"> {
  const { includeOptions = false } = options;

  return (snapshot, { transform }) => {
    const { options: optionSnapshots, ...attributes } = snapshot.attributes;
    const transformedOptions = optionSnapshots.map(transform);

    return transform({
      ...snapshot,
      attributes:
        includeOptions && transformedOptions.length > 0
          ? { ...attributes, options: transformedOptions }
          : attributes,
    });
  };
}
