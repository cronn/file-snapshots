import { mergeExpects } from "@playwright/test";

import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

import { defineAriaSnapshotMatchers } from "../matchers";

export const expect = mergeExpects(
  defineValidationFileExpect(),
  defineAriaSnapshotMatchers(),
);
