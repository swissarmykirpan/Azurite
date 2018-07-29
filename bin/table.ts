#!/usr/bin/env node

import { AzuriteTable } from "../lib/AzuriteTable";

const BbPromise = require("bluebird");

process.on("unhandledRejection", (e: any) => {
  console.error("**PANIC** Something unexpected happened! Table Storage Emulator may be in an inconsistent state!");
  console.error(e);
});
// process.noDeprecation = true;

(() => BbPromise.resolve().then(() => {
  // requiring here so that if anything went wrong,
  // during require, it will be caught.
  const argv = require("minimist")(process.argv.slice(2));
  const azurite = new AzuriteTable();
  azurite.init(argv);
}).catch((e: any) => {
  process.exitCode = 1;
  console.error(e);
}))();