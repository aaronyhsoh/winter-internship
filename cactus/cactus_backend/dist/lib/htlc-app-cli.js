#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchApp = void 0;
const cactus_cmd_api_server_1 = require("@hyperledger/cactus-cmd-api-server");
const cactus_common_1 = require("@hyperledger/cactus-common");
const htlc_app_1 = require("./htlc-app");
require('dotenv').config();
async function launchApp(env, args) {
    const configService = new cactus_cmd_api_server_1.ConfigService();
    const config = await configService.getOrCreate({ args, env });
    const serverOptions = config.getProperties();
    cactus_common_1.LoggerProvider.setLogLevel(serverOptions.logLevel);
    const appOptions = {
        logLevel: serverOptions.logLevel,
    };
    const htlcApp = new htlc_app_1.HtlcApp(appOptions);
    try {
        await htlcApp.start();
    }
    catch (ex) {
        console.error(`HtlcApp crashed. Existing...`, ex);
        await (htlcApp === null || htlcApp === void 0 ? void 0 : htlcApp.stop());
        process.exit(-1);
    }
}
exports.launchApp = launchApp;
if (require.main === module) {
    launchApp(process.env, process.argv);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRsYy1hcHAtY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2h0bGMtYXBwLWNsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsOEVBQW1FO0FBQ25FLDhEQUE0RDtBQUM1RCx5Q0FBcUM7QUFHckMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBRW5CLEtBQUssVUFBVSxTQUFTLENBQzdCLEdBQXVCLEVBQ3ZCLElBQWU7SUFFZixNQUFNLGFBQWEsR0FBRyxJQUFJLHFDQUFhLEVBQUUsQ0FBQztJQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM5RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0MsOEJBQWMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5ELE1BQU0sVUFBVSxHQUFvQjtRQUNsQyxRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVE7S0FDakMsQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxJQUFJO1FBQ0YsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDdkI7SUFBQyxPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxJQUFJLEVBQUUsQ0FBQSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjtBQUNILENBQUM7QUFwQkQsOEJBb0JDO0FBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtJQUMzQixTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDdEMifQ==