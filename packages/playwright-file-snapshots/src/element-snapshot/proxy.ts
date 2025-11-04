/// <reference lib="dom" />
import type { Locator, Page } from "@playwright/test";
import { fileURLToPath } from "node:url";

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
    const libPath = fileURLToPath(
      import.meta.resolve("@cronn/element-snapshot"),
    );
    await this.page.addScriptTag({
      path: libPath,
    });
  }
}
