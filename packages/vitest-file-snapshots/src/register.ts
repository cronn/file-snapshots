import type { VitestValidationFileMatchers } from "./matchers/types";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> extends VitestValidationFileMatchers<T> {}
}

export { registerValidationFileMatchers } from "./matchers/register-matchers";
