import { createRequire } from "node:module";
import { parseArgs } from "node:util";

import { cleanOutput } from "./clean-output";
import { deleteUnusedSnapshots } from "./delete-unused-snapshots";
import { findUnusedSnapshots } from "./find-unused-snapshots";
import { DEFAULT_DIR } from "./utils/file";

export const EXIT_CODE_SUCCESS = 0;
export const EXIT_CODE_UNUSED_SNAPSHOTS = 1;
export const EXIT_CODE_ERROR = 2;

const USAGE = `Usage: file-snapshots <command> [options]

Commands:
  check             Fail if a validation file was not written by the last test run
  prune             Delete validation files not written by the last test run
  clean             Delete the output directories

Options:
  --dir <dir>       Directory containing the "validation" and "output" directories
                    (repeatable, default: "${DEFAULT_DIR}")
  --ignore <glob>   Validation files to exclude from "check" and "prune", relative
                    to the "validation" directory (repeatable)
  -h, --help        Print this help
  -v, --version     Print the version`;

const COMMANDS = ["check", "prune", "clean"] as const;

type Command = (typeof COMMANDS)[number];

interface Logger {
  log: (message: string) => void;
  error: (message: string) => void;
}

/**
 * Runs the CLI with the given arguments and returns the exit code.
 */
export async function runCli(
  args: Array<string>,
  logger: Logger = console,
): Promise<number> {
  let parsedArgs: ReturnType<typeof parseCliArgs>;
  try {
    parsedArgs = parseCliArgs(args);
  } catch (error) {
    logger.error(`${getErrorMessage(error)}\n\n${USAGE}`);
    return EXIT_CODE_ERROR;
  }

  const { values, positionals } = parsedArgs;

  if (values.help === true) {
    logger.log(USAGE);
    return EXIT_CODE_SUCCESS;
  }

  if (values.version === true) {
    logger.log(readVersion());
    return EXIT_CODE_SUCCESS;
  }

  const [command, ...unexpectedArgs] = positionals;
  if (command === undefined) {
    logger.error(`Missing command\n\n${USAGE}`);
    return EXIT_CODE_ERROR;
  }

  if (!isCommand(command)) {
    logger.error(`Unknown command "${command}"\n\n${USAGE}`);
    return EXIT_CODE_ERROR;
  }

  if (unexpectedArgs.length > 0) {
    logger.error(
      `Unexpected argument(s): ${unexpectedArgs.join(" ")}\n\n${USAGE}`,
    );
    return EXIT_CODE_ERROR;
  }

  const options = { dirs: values.dir, ignore: values.ignore };

  try {
    return await runCommand(command, options, logger);
  } catch (error) {
    logger.error(getErrorMessage(error));
    return EXIT_CODE_ERROR;
  }
}

function parseCliArgs(args: Array<string>) {
  return parseArgs({
    args,
    strict: true,
    allowPositionals: true,
    options: {
      dir: { type: "string", multiple: true },
      ignore: { type: "string", multiple: true },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
  });
}

function isCommand(value: string): value is Command {
  return COMMANDS.includes(value as Command);
}

async function runCommand(
  command: Command,
  options: { dirs?: Array<string>; ignore?: Array<string> },
  logger: Logger,
): Promise<number> {
  switch (command) {
    case "check": {
      const unusedSnapshots = await findUnusedSnapshots(options);
      if (unusedSnapshots.length === 0) {
        logger.log("No unused validation files found.");
        return EXIT_CODE_SUCCESS;
      }

      logger.error(
        [
          `Found ${unusedSnapshots.length} unused validation file(s):`,
          ...unusedSnapshots.map((snapshot) => `  • ${snapshot.path}`),
          "",
          'Run "file-snapshots prune" to delete them.',
          "If a file is only written in some test runs, exclude it with --ignore <glob>.",
        ].join("\n"),
      );
      return EXIT_CODE_UNUSED_SNAPSHOTS;
    }
    case "prune": {
      const deletedSnapshots = await deleteUnusedSnapshots(options);
      for (const snapshot of deletedSnapshots) {
        logger.log(`Deleted ${snapshot.path}`);
      }
      logger.log(
        `Deleted ${deletedSnapshots.length} unused validation file(s).`,
      );
      return EXIT_CODE_SUCCESS;
    }
    case "clean": {
      const deletedDirs = await cleanOutput(options);
      for (const dir of deletedDirs) {
        logger.log(`Deleted ${dir}`);
      }
      return EXIT_CODE_SUCCESS;
    }
  }
}

function readVersion(): string {
  const require = createRequire(import.meta.url);
  const packageJson = require("../package.json") as { version: string };
  return packageJson.version;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
