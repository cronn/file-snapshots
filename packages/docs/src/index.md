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
  - title: Directory Comparison
    details: Compare validation and output directories to find unused snapshots and retrieve changed snapshots from pipeline runs.
  - title: Multiple File Formats
    details: Support for JSON and other text formats like Markdown - choose the best format for your use case.
  - title: Zero Configuration
    details: Snapshot file names are automatically derived from test names - no manual file path management required.
  - title: Snapshot Normalization
    details: Mask dynamic parts of snapshots like timestamps or IDs to create stable snapshot files.
  - title: Automatic Updates
    details: Update snapshots automatically when running tests in update mode, making test maintenance effortless.
---
