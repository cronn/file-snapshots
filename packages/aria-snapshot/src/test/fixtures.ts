import { mergeExpects } from "@playwright/test";

import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

import { defineAriaSnapshotMatchers } from "../matchers";

export const expect = mergeExpects(
  defineFileSnapshotMatchers(),
  defineAriaSnapshotMatchers(),
);
