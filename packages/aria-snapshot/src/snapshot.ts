import type { Locator } from "@playwright/test";
import { parse } from "yaml";

import type { ParsedSinglePropertyObject, PlainObject } from "./utils";
import {
  isArray,
  isNonNullish,
  isPlainObject,
  isSingleItemArray,
  isString,
  parseSinglePropertyObject,
  unwrapSingleItemArray,
} from "./utils";

/**
 * Creates an ARIA Snapshot of the specified element
 *
 * @example
 * ```ts
 * await expect(snapshotAria(page.getByRole("main"))).toMatchJsonSnapshot();
 * ```
 * @param locator Locator for the element to snapshot
 */
export async function snapshotAria(locator: Locator): Promise<unknown> {
  return await new AriaSnapshot().snapshot(locator);
}

class AriaSnapshot {
  private readonly textNodeTypes = ["text", "paragraph"];

  public async snapshot(locator: Locator): Promise<unknown> {
    const yamlSnapshot = await locator.ariaSnapshot();
    const jsonSnapshot: unknown = await parse(yamlSnapshot);
    return this.normalizeJsonRecursive(jsonSnapshot);
  }

  private normalizeJsonRecursive(value: unknown): unknown {
    if (isArray(value)) {
      return this.normalizeArray(value);
    }

    if (isPlainObject(value)) {
      return this.normalizeObject(value);
    }

    if (isString(value)) {
      return this.normalizeString(value);
    }

    return value;
  }

  private normalizeArray(array: Array<unknown>): unknown {
    const normalizedArray = array
      .map((item) => this.normalizeJsonRecursive(item))
      .filter(isNonNullish);

    if (isSingleItemArray(normalizedArray)) {
      return unwrapSingleItemArray(normalizedArray);
    }

    return normalizedArray;
  }

  private normalizeObject(value: PlainObject): unknown {
    const objectEntries = Object.entries(value);
    const normalizedObject: PlainObject = {};
    for (const [key, value] of objectEntries) {
      normalizedObject[this.normalizeString(key)] =
        this.normalizeJsonRecursive(value);
    }

    const parsedNode = parseSinglePropertyObject(value);
    if (this.isAtomicTextNode(parsedNode)) {
      return this.unwrapAtomicTextNode(parsedNode);
    }

    return normalizedObject;
  }

  private isAtomicTextNode(
    node: ParsedSinglePropertyObject,
  ): node is ParsedSinglePropertyObject<string> {
    return (
      this.textNodeTypes.some(
        (textObjectType) => node.key === textObjectType,
      ) && isString(node.value)
    );
  }

  private unwrapAtomicTextNode(
    node: ParsedSinglePropertyObject<string>,
  ): string {
    return `${node.key} '${node.value}'`;
  }

  private normalizeString(value: string): string {
    return value.replaceAll('"', "'");
  }
}
