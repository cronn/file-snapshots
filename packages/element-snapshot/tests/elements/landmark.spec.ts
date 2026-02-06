import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML header outside other landmark", async ({ page }) => {
  await matchRawElementSnapshot(page, `<header>Header</header>`);
});

test("HTML header inside other landmark", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <main>
        <header>Header</header>
      </main>
    `,
  );
});

test("role-based banner", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="banner">Banner</div>`);
});

test("HTML nav", async ({ page }) => {
  await matchRawElementSnapshot(page, `<nav>Navigation</nav>`);
});

test("role-based navigation", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<div role="navigation">Navigation</div>`,
  );
});

test("HTML search", async ({ page }) => {
  await matchRawElementSnapshot(page, `<search>Search</search>`);
});

test("role-based search", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="search">Search</div>`);
});

test("HTML main", async ({ page }) => {
  await matchRawElementSnapshot(page, `<main>Main</main>`);
});

test("role-based main", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="main">Main</div>`);
});

test("HTML article", async ({ page }) => {
  await matchRawElementSnapshot(page, `<article>Article</article>`);
});

test("role-based article", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="article">Article</div>`);
});

test("HTML aside", async ({ page }) => {
  await matchRawElementSnapshot(page, `<aside>Aside</aside>`);
});

test("role-based complementary", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<div role="complementary">Complementary</div>`,
  );
});

test("HTML section", async ({ page }) => {
  await matchRawElementSnapshot(page, `<section>Section content</section>`);
});

test("named HTML section", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<section aria-label="Name">Section content</section>`,
  );
});

test("role-based region", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<div role="region" aria-label="Region Name">Region</div>`,
  );
});

test("HTML footer", async ({ page }) => {
  await matchRawElementSnapshot(page, `<footer>Footer</footer>`);
});

test("role-based contentinfo", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<div role="contentinfo">Contentinfo</div>`,
  );
});

test("HTML form", async ({ page }) => {
  await matchRawElementSnapshot(page, `<form>Form</form>`);
});

test("role-based form", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="form">Form</div>`);
});
