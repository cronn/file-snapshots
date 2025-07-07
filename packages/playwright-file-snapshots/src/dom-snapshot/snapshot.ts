import type { Locator } from "@playwright/test";

import { DomSnapshotProxy } from "./proxy";
import { DomSnapshotTransformer } from "./transformer";

/**
 * Creates a DOM Snapshot of the specified element
 *
 * @example
 * ```ts
 * await expect(snapshotDom(page.getByRole("main"))).toMatchJsonSnapshot();
 * ```
 * @param locator Locator for the element to snapshot
 * @experimental
 */
export async function snapshotDom(locator: Locator): Promise<unknown> {
  const snapshot = await new DomSnapshotProxy(locator.page()).snapshotElement(
    locator,
  );
  return new DomSnapshotTransformer().transform(snapshot);
}
