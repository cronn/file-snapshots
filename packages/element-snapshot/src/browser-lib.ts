import { snapshotElement } from "./browser/element";

declare global {
  interface Window {
    snapshotElement: typeof snapshotElement;
  }
}

window.snapshotElement = snapshotElement;
