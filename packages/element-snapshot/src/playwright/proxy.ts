import type { Locator, Page } from "@playwright/test";
import path from "node:path";
import { packageDirectory } from "package-directory";

import type { NodeSnapshot } from "../browser/types";

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
    const packageRootDir = await this.resolvePackageRootDir();
    const libPath = path.resolve(
      packageRootDir,
      "dist",
      "browser-lib.global.js",
    );
    await this.page.addScriptTag({
      path: libPath,
    });
  }

  private async resolvePackageRootDir(): Promise<string> {
    const packageDir = await packageDirectory({
      cwd: import.meta.dirname,
    });

    if (packageDir === undefined) {
      throw new Error("Unable to resolve root directory of package");
    }

    return packageDir;
  }
}
