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
          text: "Playwright",
          items: [
            { text: "Overview", link: "/playwright/" },
            { text: "Getting Started", link: "/playwright/getting-started" },
            { text: "Writing Tests", link: "/playwright/writing-tests" },
            { text: "Configuration", link: "/playwright/configuration" },
            {
              text: "Element Snapshots",
              collapsed: true,
              items: [
                {
                  text: "Getting Started",
                  link: "/playwright/element-snapshots/",
                },
                {
                  text: "General-Purpose Snapshots",
                  link: "/playwright/element-snapshots/general-purpose-snapshots",
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
        },
      ],
      "/vitest/": [
        {
          text: "Vitest",
          items: [
            { text: "Overview", link: "/vitest/" },
            { text: "Getting Started", link: "/vitest/getting-started" },
            { text: "Writing Tests", link: "/vitest/writing-tests" },
            { text: "Configuration", link: "/vitest/configuration" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/cronn/file-snapshots" },
    ],
  },
});
