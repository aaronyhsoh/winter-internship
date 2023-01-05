#!/usr/bin/env node

import { ConfigService } from "@hyperledger/cactus-cmd-api-server";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { HtlcApp } from "./htlc-app";
import { IHtlcAppOptions } from "./htlc-app-types";

require('dotenv').config()

export async function launchApp(
  env?: NodeJS.ProcessEnv,
  args?: string[],
): Promise<void> {
  const configService = new ConfigService();
  const config = await configService.getOrCreate({ args, env });
  const serverOptions = config.getProperties();
  LoggerProvider.setLogLevel(serverOptions.logLevel);

  const appOptions: IHtlcAppOptions = {
    logLevel: serverOptions.logLevel,
  };
  const htlcApp = new HtlcApp(appOptions);
  try {
    await htlcApp.start();
  } catch (ex) {
    console.error(`HtlcApp crashed. Existing...`, ex);
    await htlcApp?.stop();
    process.exit(-1);
  }
}

if (require.main === module) {
  launchApp(process.env, process.argv);
}
