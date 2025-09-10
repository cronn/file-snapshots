/// <reference lib="dom" />
import type { Locator, Page } from "@playwright/test";
import path from "node:path";
import { packageDirectory } from "package-directory";

export class DomSnapshotProxy {
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
    const rootDir = await this.resolveRootDir();
    await this.page.addScriptTag({
      path: path.join(rootDir, "dist", "dom-snapshot.js"),
    });
  }

  private async resolveRootDir(): Promise<string> {
    const packageDir = await packageDirectory({
      cwd: import.meta.dirname,
    });

    if (packageDir === undefined) {
      throw new Error("Unable to resolve root directory of package");
    }

    return packageDir;
  }
}
