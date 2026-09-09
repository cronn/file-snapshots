import type { Locator, Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { packageDirectory } from "package-directory";

import type { NodeSnapshot } from "../types/snapshot";

export class ElementSnapshotProxy {
  private static browserLibSource: string | undefined = undefined;

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
    // cache browser lib source to avoid reading it multiple times
    ElementSnapshotProxy.browserLibSource ??= await this.readBrowserLibSource();

    await this.page.evaluate(ElementSnapshotProxy.browserLibSource);
  }

  private async readBrowserLibSource(): Promise<string> {
    const libPath = await this.resolveFromPackageRoot(
      "dist",
      "browser-lib.iife.js",
    );
    return await fs.readFile(libPath, "utf8");
  }

  private async resolveFromPackageRoot(
    ...paths: Array<string>
  ): Promise<string> {
    const packageRoot = await packageDirectory({
      cwd: import.meta.dirname,
    });

    if (packageRoot === undefined) {
      throw new Error("Unable to resolve root directory of package");
    }

    return path.resolve(packageRoot, ...paths);
  }
}
