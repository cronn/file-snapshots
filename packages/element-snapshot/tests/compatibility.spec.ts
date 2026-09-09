import test from "@playwright/test";

import { html, setupCspSnapshotTest } from "@cronn/test-utils/playwright";

import { rawSnapshot } from "../src/playwright/snapshot";
import { expect } from "../src/test/fixtures";

test("injected browser library complies with strict content security policy", async ({
  page,
}) => {
  const errorLogs: Array<string> = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errorLogs.push(message.text());
    }
  });

  const bodyLocator = await setupCspSnapshotTest(
    page,
    "script-src 'none';",
    html`<button>Edit</button>`,
  );

  await expect(rawSnapshot(bodyLocator)).toMatchJsonFile();
  expect(errorLogs).toHaveLength(0);

  await page.evaluate(() => {
    const script = document.createElement("script");
    script.textContent = "alert('XSS Injection');";
    document.head.appendChild(script);
  });
  expect(errorLogs).toHaveLength(1);
});
