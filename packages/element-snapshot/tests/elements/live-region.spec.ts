import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("alert", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="alert">Alert</div>`);
});

test("role-based status", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="status">Loading complete</div>`,
  );
});

test("role-based status with accessible name", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="status" aria-label="Save status">Loading complete</div>`,
  );
});

test("output element", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<output>42</output>`);
});

test("role-based log", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="log">New message received</div>`,
  );
});

test("role-based log with accessible name", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="log" aria-label="Chat history">New message received</div>`,
  );
});
