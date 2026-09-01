import type { RoleBasedSnapshotTransformer } from "../types/transformer";

import { transformElementSnapshot } from "./semantic-snapshot-transformer";

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
): RoleBasedSnapshotTransformer<"combobox"> {
  const { includeOptions = false } = options;

  return (snapshot, { transform }) => {
    const { options: optionSnapshots, ...attributes } = snapshot.attributes;
    const transformedOptions = optionSnapshots.map(transform);

    return transformElementSnapshot(
      {
        ...snapshot,
        attributes:
          includeOptions && transformedOptions.length > 0
            ? { ...attributes, options: transformedOptions }
            : attributes,
      },
      transform,
    );
  };
}
