import type { Page } from "@playwright/test";

import type { NodeSnapshot } from "../types/snapshot";
import type {
  DefaultSnapshotTransformer,
  RoleBasedSnapshotTransformers,
} from "../types/transformer";
import type { PlaywrightTarget } from "../types/utils";
import type { FilterPredicate } from "../utils/filter";

import { ElementSnapshotProxy } from "./proxy";
import { SnapshotSerializer } from "./snapshot-serializer";

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
   * Replace the default transformation for specific roles
   *
   * Transformers are keyed by role and applied after the filter, but before
   * the default serialization. A transformer may return any JSON-serializable
   * value, which is written to the snapshot verbatim. The `transform` function
   * of its context applies the default transformation to untransformed
   * children.
   *
   * Entries override the built-in transformers for the same role.
   *
   * @default { combobox: comboboxTransformer() }
   */
  transformers?: RoleBasedSnapshotTransformers;

  /**
   * Replace the default transformation for all roles
   *
   * Applied to every snapshot passed to the default transformation, including
   * the ones a transformer delegates via the `transform` function of its
   * context. Transformers registered for a role take precedence.
   *
   * @default semanticSnapshotTransformer
   */
  defaultTransformer?: DefaultSnapshotTransformer;
}

/**
 * Captures a semantic snapshot of the specified locator's DOM structure.
 *
 * This function creates a raw snapshot of the DOM element identified by the locator
 * and transforms it into a semantic representation using the provided options.
 *
 * @param target - The Page or Locator instance that identifies the DOM element to snapshot
 * @param options - Optional configuration settings for controlling the snapshot behavior
 * @return A promise that resolves to the semantic snapshot
 */
export async function semanticSnapshot(
  target: PlaywrightTarget,
  options?: SemanticSnapshotOptions,
): Promise<unknown> {
  const snapshot = await rawSnapshot(target);
  return new SnapshotSerializer(options).transform(snapshot);
}

/**
 * Captures a raw snapshot of the element matched by the provided locator.
 *
 * Returns an array of node snapshots representing the current state of the matched elements
 * in the DOM, including their properties, attributes, and structure.
 *
 * @param target - The Page or Locator instance used to identify the target element to snapshot
 * @return A promise that resolves to an array of NodeSnapshot objects representing the captured element
 */
export async function rawSnapshot(
  target: PlaywrightTarget,
): Promise<Array<NodeSnapshot>> {
  const locator = isPage(target) ? target.locator("body") : target;
  return await new ElementSnapshotProxy(locator.page()).snapshotElement(
    locator,
  );
}

function isPage(target: PlaywrightTarget): target is Page {
  return "goto" in target && typeof target.goto === "function";
}
