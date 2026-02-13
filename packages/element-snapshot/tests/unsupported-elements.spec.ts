import test from "@playwright/test";

import { matchRawElementSnapshot } from "../src/test/fixtures";

test("ignores style element", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <style>
        * {
          margin: 0;
        }
      </style>
    `,
  );
});

test("ignores script element", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <script>
        console.log("Hello world!");
      </script>
    `,
  );
});

test("ignores noscript element", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<noscript>JavaScript is disabled.</noscript>`,
  );
});

test("ignores template element", async ({ page }) => {
  await matchRawElementSnapshot(page, `<template>Template Content</template>`);
});

test("ignores picture element", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <picture>
        <source srcset="picture2.jpg" media="(orientation: portrait)" />
        <img src="/picture1.jpg" alt="Picture" />
      </picture>
    `,
  );
});

test("ignores audio element", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <audio controls>
        <source src="audio.mp3" type="audio/mpeg" />
        Download the <a href="audio.mp3">MP3</a> audio.
      </audio>
    `,
  );
});

test("ignores video element", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <video controls width="250">
        <source src="/video.mp4" type="video/mp4" />
        Download the <a href="video.mp4">MP4</a> video.
      </video>
    `,
  );
});

test("ignores figure element", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <figure>
        <img src="/image.jpg" alt="Image" />
        <figcaption>Figure Caption</figcaption>
      </figure>
    `,
  );
});
