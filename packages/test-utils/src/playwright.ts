import type { Locator, Page } from "@playwright/test";

const CSP_TEST_URL = "http://localhost/csp-test";

export function html(
  strings: TemplateStringsArray,
  ...values: Array<string>
): string {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ?? "");
  }, "");
}

export async function setupSnapshotTest(
  page: Page,
  content: string,
): Promise<Locator> {
  await page.setContent(wrapInTestPage(content));

  return page.locator("body");
}

/**
 * Serves the test page with a `Content-Security-Policy` response header, to
 * verify that snapshots work without violating a strict policy.
 */
export async function setupCspSnapshotTest(
  page: Page,
  cspHeader: string,
  content: string,
): Promise<Locator> {
  await page.route(CSP_TEST_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      headers: {
        "Content-Security-Policy": cspHeader,
      },
      body: wrapInTestPage(content),
    }),
  );
  await page.goto(CSP_TEST_URL);

  return page.locator("body");
}

function wrapInTestPage(content: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Test Page</title>
  </head>
  <body>
    ${content}
  </body>
</html>
`;
}
