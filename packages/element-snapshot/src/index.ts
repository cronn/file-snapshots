import { snapshotElement } from "./snapshots/element";

declare global {
  interface Window {
    snapshotElement: typeof snapshotElement;
  }
}

window.snapshotElement = snapshotElement;
