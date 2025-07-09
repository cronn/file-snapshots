import tseslint from "typescript-eslint";

import { eslintConfig } from "./src/eslint";

export default tseslint.config(eslintConfig());
