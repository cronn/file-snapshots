import type { Locator, MatcherReturnType } from "@playwright/test";

import type {
  PlaywrightMatchJsonFileOptions,
  PlaywrightMatchTextFileOptions,
} from "@cronn/playwright-file-snapshots";

import type { MarkdownTableSnapshotOptions } from "../playwright/markdown-table";
import type { SemanticSnapshotOptions } from "../playwright/snapshot";

import type { PlaywrightTarget } from "./utils";

export interface ElementSnapshotMatchers {
  toMatchSemanticSnapshotFile: (
    actual: PlaywrightTarget,
    options?: MatchSemanticSnapshotFileOptions,
  ) => Promise<MatcherReturnType>;
  toMatchMarkdownTableSnapshotFile: (
    actual: Locator,
    options?: MatchMarkdownTableSnapshotFileOptions,
  ) => Promise<MatcherReturnType>;
}

export interface MatchSemanticSnapshotFileOptions
  extends PlaywrightMatchJsonFileOptions, SemanticSnapshotOptions {}

export interface MatchMarkdownTableSnapshotFileOptions
  extends
    Omit<PlaywrightMatchTextFileOptions, "fileExtension" | "normalizers">,
    MarkdownTableSnapshotOptions {}
