import type { VitestValidationFileMatchers } from "./matchers/types";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> extends VitestValidationFileMatchers<T> {}
}

export { registerFileSnapshotMatchers } from "./matchers/register-matchers";
