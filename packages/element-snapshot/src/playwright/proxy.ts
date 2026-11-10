import type { Frame, Locator } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { packageDirectory } from "package-directory";

import type { NodeSnapshot } from "../types/snapshot";

export class ElementSnapshotProxy {
  private static browserLibSource: string | undefined = undefined;

  public async snapshotElement(locator: Locator): Promise<Array<NodeSnapshot>> {
    // the library must be loaded into the element's own frame, which differs
    // from the page's main frame for elements inside iframes
    if (!(await this.isLibraryLoaded(locator))) {
      await this.loadLibrary(await this.resolveOwnerFrame(locator));
    }

    return await locator.evaluate((element) => {
      return window.snapshotElement(element);
    });
  }

  private async isLibraryLoaded(locator: Locator): Promise<boolean> {
    return await locator.evaluate(
      () => typeof window.snapshotElement === "function",
    );
  }

  private async resolveOwnerFrame(locator: Locator): Promise<Frame> {
    const elementHandle = await locator.elementHandle();
    try {
      const frame = await elementHandle.ownerFrame();
      if (frame === null) {
        throw new Error("Unable to resolve frame of element");
      }
      return frame;
    } finally {
      await elementHandle.dispose();
    }
  }

  private async loadLibrary(frame: Frame): Promise<void> {
    // cache browser lib source to avoid reading it multiple times
    ElementSnapshotProxy.browserLibSource ??= await this.readBrowserLibSource();

    // evaluate source via Playwright instead of in-page `eval` to comply with
    // strict content security policies
    await frame.evaluate(ElementSnapshotProxy.browserLibSource);
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
