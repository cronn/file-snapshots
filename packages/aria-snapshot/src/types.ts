import type { Locator, MatcherReturnType } from "@playwright/test";

import type { PlaywrightMatchJsonFileOptions } from "@cronn/playwright-file-snapshots";

export interface AriaSnapshotMatchers {
  toMatchAriaSnapshotFile: (
    actual: Locator,
    options?: PlaywrightMatchJsonFileOptions,
  ) => Promise<MatcherReturnType>;
}
