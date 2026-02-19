import type { Locator } from "@playwright/test";

import type { NodeSnapshot } from "../browser/types";
import type { SnapshotFilter } from "../utils/snapshot";

import { ElementSnapshotProxy } from "./proxy";
import { ElementSnapshotTransformer } from "./transformer";

export interface ElementSnapshotOptions {
  /**
   * Include only elements in the snapshot for which the specified filter returns `true`
   *
   * @default () => true
   */
  filter?: SnapshotFilter;

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
 * Creates an Element Snapshot of the specified element
 *
 * @example
 * ```ts
 * await expect(snapshotElement(page.getByRole("main"))).toMatchJsonSnapshot();
 * ```
 * @param locator Locator for the element to snapshot
 * @experimental
 */
export async function snapshotElement(
  locator: Locator,
  options?: ElementSnapshotOptions,
): Promise<unknown> {
  const snapshot = await snapshotElementRaw(locator);
  return new ElementSnapshotTransformer(options).transform(snapshot);
}

/**
 * Creates an Element Snapshot of the specified element, returning the raw snapshot data for custom transformations
 *
 * @param locator Locator for the element to snapshot
 * @experimental
 */
export async function snapshotElementRaw(
  locator: Locator,
): Promise<Array<NodeSnapshot>> {
  return await new ElementSnapshotProxy(locator.page()).snapshotElement(
    locator,
  );
}
