import tseslint from "typescript-eslint";

import { eslintConfig } from "@cronn/shared-configs/eslint";

export default tseslint.config(eslintConfig());
