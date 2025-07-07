export interface TextSnapshot {
  role: "text";
  name: string;
}

export function snapshotTextNode(textNode: Node): TextSnapshot | null {
  const textContent = snapshotTextContent(textNode);
  if (textContent === undefined) {
    return null;
  }

  return {
    role: "text",
    name: textContent,
  };
}

export function snapshotTextContent(element: Node): string | undefined {
  if (element.textContent === null) {
    return undefined;
  }

  const normalizedText = element.textContent.replaceAll(/\s+/g, " ").trim();
  return normalizedText !== "" ? normalizedText : undefined;
}
