#!/usr/bin/env node
import { runCli } from "./run-cli";

process.exitCode = await runCli(process.argv.slice(2));
