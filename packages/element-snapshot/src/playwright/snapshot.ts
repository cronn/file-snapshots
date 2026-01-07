import type { Locator } from "@playwright/test";

import type { NodeSnapshot } from "../browser/types";

import { ElementSnapshotProxy } from "./proxy";
import { ElementSnapshotTransformer } from "./transformer";

export interface ElementSnapshotOptions {
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
