import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "File Snapshots",
  description: "Write tests with file snapshots in Playwright and Vitest.",
  base: "/file-snapshots/",
  srcDir: "src",
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },

    nav: [
      { text: "Home", link: "/" },
      { text: "Introduction", link: "/introduction" },
      { text: "Playwright", link: "/playwright/" },
      { text: "Vitest", link: "/vitest/" },
    ],

    sidebar: {
      "/playwright/": [
        {
          text: "Playwright File Snapshots",
          items: [
            { text: "Overview", link: "/playwright/" },
            { text: "Getting Started", link: "/playwright/getting-started" },
            { text: "Writing Tests", link: "/playwright/writing-tests" },
            { text: "Configuration", link: "/playwright/configuration" },
            {
              text: "File Matchers",
              collapsed: false,
              items: [
                {
                  text: "toMatchJsonFile",
                  link: "/playwright/file-matchers/to-match-json-file",
                },
                {
                  text: "toMatchTextFile",
                  link: "/playwright/file-matchers/to-match-text-file",
                },
              ],
            },
          ],
        },
        {
          text: "Element Snapshots",
          collapsed: false,
          items: [
            {
              text: "Getting Started",
              link: "/playwright/element-snapshots/",
            },
            {
              text: "Semantic Snapshots",
              link: "/playwright/element-snapshots/semantic-snapshots",
            },
            {
              text: "Markdown Table Snapshot",
              link: "/playwright/element-snapshots/markdown-table-snapshot",
            },
            {
              text: "Custom Snapshots",
              link: "/playwright/element-snapshots/custom-snapshots",
            },
          ],
        },
        { text: "ARIA Snapshots", link: "/playwright/aria-snapshots" },
      ],
      "/vitest/": [
        {
          text: "Vitest File Snapshots",
          items: [
            { text: "Overview", link: "/vitest/" },
            { text: "Getting Started", link: "/vitest/getting-started" },
            { text: "Writing Tests", link: "/vitest/writing-tests" },
            { text: "Configuration", link: "/vitest/configuration" },
            {
              text: "File Matchers",
              collapsed: false,
              items: [
                {
                  text: "toMatchJsonFile",
                  link: "/vitest/file-matchers/to-match-json-file",
                },
                {
                  text: "toMatchTextFile",
                  link: "/vitest/file-matchers/to-match-text-file",
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/cronn/file-snapshots" },
    ],
  },
});
