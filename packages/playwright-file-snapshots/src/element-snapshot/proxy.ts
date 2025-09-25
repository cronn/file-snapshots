/// <reference lib="dom" />
import type { Locator, Page } from "@playwright/test";
import path from "node:path";

import { resolvePackageRootDir } from "../utils/file";

export class ElementSnapshotProxy {
  private readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  public async snapshotElement(locator: Locator): Promise<Array<NodeSnapshot>> {
    if (!(await this.isLibraryLoaded())) {
      await this.loadLibrary();
    }

    return await locator.evaluate((element) => {
      return window.snapshotElement(element);
    });
  }

  private async isLibraryLoaded(): Promise<boolean> {
    return await this.page.evaluate(
      () => typeof window.snapshotElement === "function",
    );
  }

  private async loadLibrary(): Promise<void> {
    const rootDir = await resolvePackageRootDir(import.meta.dirname);
    await this.page.addScriptTag({
      path: path.join(rootDir, "dist", "element-snapshot.js"),
    });
  }
}
