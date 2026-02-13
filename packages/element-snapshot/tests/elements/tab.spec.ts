import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("tabs", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="tablist" aria-label="Tablist">
        <button
          role="tab"
          aria-selected="true"
          aria-controls="panel-1"
          id="tab-1"
          tabindex="0"
        >
          Tab 1
        </button>
        <button
          role="tab"
          aria-selected="false"
          aria-controls="panel-2"
          id="tab-2"
          tabindex="-1"
        >
          Tab 2
        </button>
        <button
          role="tab"
          aria-selected="false"
          aria-controls="panel-3"
          id="tab-3"
          tabindex="-1"
        >
          Tab 3
        </button>
      </div>
      <div id="panel-1" role="tabpanel" tabindex="0" aria-labelledby="tab-1">
        Tabpanel 1
      </div>
      <div
        id="panel-2"
        role="tabpanel"
        tabindex="0"
        aria-labelledby="tab-2"
        hidden
      >
        Tabpanel 2
      </div>
      <div
        id="panel-3"
        role="tabpanel"
        tabindex="0"
        aria-labelledby="tab-3"
        hidden
      >
        Tabpanel 3
      </div>
    `,
  );
});

test("empty tablist", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="tablist"></div>`);
});

test("empty tab", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="tablist">
        <div role="tab"></div>
      </div>
    `,
  );
});

test("empty tabpanel", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="tabpanel"></div>`);
});

test("ignores tab outside tablist", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="tab">Tab</div>`);
});
