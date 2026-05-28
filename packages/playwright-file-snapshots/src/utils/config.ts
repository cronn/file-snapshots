import type { PlaywrightValidationFileMatcherConfig } from "../matchers/types";

/**
 * Defines a configuration object for the Playwright validation file matcher.
 * This function provides type safety and IntelliSense support for configuration options.
 *
 * @param {PlaywrightValidationFileMatcherConfig} options - The configuration options for the Playwright validation file matcher
 * @return {PlaywrightValidationFileMatcherConfig} The same configuration object passed as input, with proper typing applied
 */
export function defineConfig(
  options: PlaywrightValidationFileMatcherConfig,
): PlaywrightValidationFileMatcherConfig {
  return options;
}
