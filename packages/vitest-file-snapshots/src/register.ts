import type { VitestValidationFileMatchers } from "./matchers/types";

declare module "vitest" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Matchers<R, T> extends VitestValidationFileMatchers<R> {}
}

export { registerFileSnapshotMatchers } from "./matchers/register-matchers";
