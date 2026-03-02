import { createUpdateOptions } from "@pnpm/meta-updater";

import { updatePackageJson } from "@cronn/meta-updater";

export default function () {
  return createUpdateOptions({
    files: {
      "package.json": updatePackageJson,
    },
  });
}
