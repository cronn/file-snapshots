# File Snapshots Documentation

Documentation for the packages published from the [file-snapshots](https://github.com/cronn/file-snapshots) monorepo.

This package contains the VitePress-based documentation site for the file snapshot testing libraries, including `@cronn/playwright-file-snapshots` and `@cronn/vitest-file-snapshots`.

## Working with VitePress

This documentation site is built with [VitePress](https://vitepress.dev/), a static site generator powered by Vite and Vue.

### Documentation Structure

- **Configuration**: `.vitepress/config.ts` - Site configuration, theme settings, and navigation
- **Content**: `src/` - Markdown documentation files
- **Output**: `.vitepress/dist/` - Built static site (generated during build)

### Available Tasks

The following tasks are available:

#### Start Development Server

```shell
pnpm turbo docs:dev
```

Starts the VitePress development server with hot module replacement (HMR). Changes to markdown files and configuration will automatically reload in the browser.

#### Build for Production

```shell
pnpm turbo docs:build
```

Builds the documentation site for production. Generates static HTML files in `.vitepress/dist/`.

#### Preview Production Build

```shell
pnpm docs:preview
```

Locally preview the production build. Run this after `docs:build` to test the built site before deployment.

### Writing Documentation

Documentation files are written in Markdown and placed in the `src/` directory. VitePress extends standard Markdown with:

- **Frontmatter**: YAML metadata at the top of files
- **Vue Components**: Embed Vue components in markdown
- **Custom Containers**: Info boxes, warnings, tips, etc.
- **Code Blocks**: Syntax highlighting and features like line highlighting

See the [VitePress documentation](https://vitepress.dev/guide/markdown) for more details on markdown extensions.
