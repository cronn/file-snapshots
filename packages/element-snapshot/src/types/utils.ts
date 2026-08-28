import type { Locator, Page } from "@playwright/test";

export type SetValues<TSet> = TSet extends Set<infer TValue> ? TValue : never;

export type PlaywrightTarget = Page | Locator;
