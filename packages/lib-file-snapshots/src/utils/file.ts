import fs from "node:fs";

const NEW_LINE_SEPARATOR = "\n";

// based on https://stackoverflow.com/a/79511230
const EMOJI_REGEXP =
  /(?!(\*|#|\d))[\p{Extended_Pictographic}\p{Emoji_Component}]|[\u0030-\u0039]\ufe0f?[\u20e3]|[\u002A\u0023]?\ufe0f?[\u20e3]/gu;

export function normalizeFileName(testName: string): string {
  return testName
    .replaceAll(EMOJI_REGEXP, "")
    .replaceAll(/[+*%~<>?!$#'"`|\\/()[\]{}]/g, "")
    .replaceAll(/[\s.:,;]+/g, "_")
    .replaceAll(/_{2,}/g, "_");
}

export function mkdirRecursive(path: string): void {
  fs.mkdirSync(path, { recursive: true });
}

export function readSnapshotFile(path: string): string {
  return fs.readFileSync(path, { encoding: "utf8" });
}

export function writeSnapshotFile(
  file: string,
  data: string,
  markAsMissing = false,
): void {
  let finalizedData = addTrailingNewLine(data);
  if (markAsMissing) {
    finalizedData = addMissingFileMarker(finalizedData);
  }

  fs.writeFileSync(file, finalizedData, { encoding: "utf8" });
}

function addTrailingNewLine(data: string): string {
  return `${data}${NEW_LINE_SEPARATOR}`;
}

function addMissingFileMarker(data: string): string {
  return `===== missing file =====${NEW_LINE_SEPARATOR}${data}`;
}
