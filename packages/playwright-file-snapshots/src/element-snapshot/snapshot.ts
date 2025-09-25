import type { Locator } from "@playwright/test";

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
  const snapshot = await new ElementSnapshotProxy(
    locator.page(),
  ).snapshotElement(locator);
  return new ElementSnapshotTransformer(options).transform(snapshot);
}
