---
layout: home

hero:
  name: "File Snapshots"
  text: "Write better tests with file-based snapshots"
  tagline: "Snapshot testing for Playwright and Vitest with file-based comparison and automatic updates"
  actions:
    - theme: brand
      text: Introduction
      link: /introduction
    - theme: alt
      text: Playwright File Snapshots
      link: /playwright/
    - theme: alt
      text: Vitest File Snapshots
      link: /vitest/
    - theme: alt
      text: View on GitHub
      link: https://github.com/cronn/file-snapshots

features:
  - title: File-Based Snapshots
    details: Store snapshots as separate files for better version control, easier review, and improved diff readability.
  - title: Zero Configuration
    details: Snapshot file names are automatically derived from test names - no manual file path management required.
  - title: Multiple File Formats
    details: Support for JSON, text, and custom formats like Markdown - choose the best format for your use case.
  - title: Snapshot Normalization
    details: Mask dynamic parts of snapshots like timestamps or IDs to create stable, maintainable snapshot files.
  - title: Automatic Updates
    details: Update snapshots automatically when running tests in update mode, making test maintenance effortless.
  - title: Custom Snapshots for Playwright
    details: Built-in ARIA and Element snapshots for testing accessibility and semantic structure, plus support for custom snapshot formats.
---
