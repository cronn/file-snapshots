import fs from "node:fs";

const NEW_LINE_SEPARATOR = "\n";

export function normalizeFileName(testName: string): string {
  return testName
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
