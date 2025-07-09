import type { VitestValidationFileMatchers } from "./matchers/types";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends VitestValidationFileMatchers<T> {}
  interface AsymmetricMatchersContaining extends VitestValidationFileMatchers {}
}

export { registerValidationFileMatchers } from "./matchers/register-matchers";
