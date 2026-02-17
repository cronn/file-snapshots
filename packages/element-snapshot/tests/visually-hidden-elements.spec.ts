import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../src/test/fixtures";

test("element with hidden attribute", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div hidden>Content</div>`);
});

test("element with hidden=hidden attribute", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div hidden="hidden">Content</div>`);
});

test("element with hidden=until-found attribute", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div hidden="until-found">Content</div>`,
  );
});

test("element with arbitrary hidden attribute", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div hidden="custom">Content</div>`);
});

test("element with display:none style", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div style="display: none">Content</div>`,
  );
});

test("element with visibility:hidden style", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div style="visibility: hidden">Content</div>`,
  );
});

test("element with visibility:collapse style", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div style="visibility: collapse">Content</div>`,
  );
});

test("element with opacity:0 style", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div style="opacity: 0">Content</div>`,
  );
});

test("element with display:none class", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <style>
        .display-none {
          display: none;
        }
      </style>
      <div class="display-none">Content</div>
    `,
  );
});

test("element with visibility:hidden class", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <style>
        .visibility-hidden {
          visibility: hidden;
        }
      </style>
      <div class="visibility-hidden">Content</div>
    `,
  );
});

test("element with visibility:collapse class", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <style>
        .visibility-collapse {
          visibility: collapse;
        }
      </style>
      <div class="visibility-collapse">Content</div>
    `,
  );
});

test("element with opacity:0 class", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <style>
        .opacity-0 {
          opacity: 0;
        }
      </style>
      <div class="opacity-0">Content</div>
    `,
  );
});
