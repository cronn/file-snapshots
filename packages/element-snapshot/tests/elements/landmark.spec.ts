import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML header outside other landmark", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<header>Header</header>`);
});

test("HTML header inside other landmark", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <main>
        <header>Header</header>
      </main>
    `,
  );
});

test("role-based banner", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="banner">Banner</div>`);
});

test("HTML nav", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<nav>Navigation</nav>`);
});

test("role-based navigation", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="navigation">Navigation</div>`,
  );
});

test("HTML search", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<search>Search</search>`);
});

test("role-based search", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="search">Search</div>`);
});

test("HTML main", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<main>Main</main>`);
});

test("role-based main", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="main">Main</div>`);
});

test("HTML article", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<article>Article</article>`);
});

test("role-based article", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="article">Article</div>`);
});

test("HTML aside", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<aside>Aside</aside>`);
});

test("role-based complementary", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="complementary">Complementary</div>`,
  );
});

test("HTML section", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<section>Section content</section>`);
});

test("named HTML section", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<section aria-label="Name">Section content</section>`,
  );
});

test("role-based region", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="region" aria-label="Region Name">Region</div>`,
  );
});

test("HTML footer", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<footer>Footer</footer>`);
});

test("role-based contentinfo", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="contentinfo">Contentinfo</div>`,
  );
});

test("HTML form", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<form>Form</form>`);
});

test("role-based form", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="form">Form</div>`);
});
