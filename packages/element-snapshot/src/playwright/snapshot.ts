import type { Locator } from "@playwright/test";

import type { NodeSnapshot } from "../browser/types";
import type { FilterPredicate } from "../utils/filter";

import { ElementSnapshotProxy } from "./proxy";
import { SemanticSnapshotTransformer } from "./semantic-snapshot-transformer";

export interface SemanticSnapshotOptions {
  /**
   * Include only elements in the snapshot for which the specified filter returns `true`
   *
   * @default () => true
   */
  filter?: FilterPredicate;

  /**
   * Recursively apply specified filter to children of filtered elements
   *
   * By default, recursion ends when the filter returns `true` for an element.
   * Should be `true` for filters intended to remove specific elements recursively.
   *
   * @default false
   */
  recurseFilter?: boolean;

  /**
   * Include combobox options in the snapshot
   *
   * @default false
   */
  includeComboboxOptions?: boolean;
}

/**
 * Captures a semantic snapshot of the specified locator's DOM structure.
 *
 * This function creates a raw snapshot of the DOM element identified by the locator
 * and transforms it into a semantic representation using the provided options.
 *
 * @param locator - The Locator instance that identifies the DOM element to snapshot
 * @param options - Optional configuration settings for controlling the snapshot behavior
 * @return A promise that resolves to the semantic snapshot
 */
export async function semanticSnapshot(
  locator: Locator,
  options?: SemanticSnapshotOptions,
): Promise<unknown> {
  const snapshot = await rawSnapshot(locator);
  return new SemanticSnapshotTransformer(options).transform(snapshot);
}

/**
 * Captures a raw snapshot of the element matched by the provided locator.
 *
 * Returns an array of node snapshots representing the current state of the matched elements
 * in the DOM, including their properties, attributes, and structure.
 *
 * @param locator - The Locator instance used to identify the target element to snapshot
 * @return A promise that resolves to an array of NodeSnapshot objects representing the captured element
 */
export async function rawSnapshot(
  locator: Locator,
): Promise<Array<NodeSnapshot>> {
  return await new ElementSnapshotProxy(locator.page()).snapshotElement(
    locator,
  );
}
