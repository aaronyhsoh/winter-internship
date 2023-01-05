/// <reference types="node" />
import { Server } from "http";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { ApiServer } from "@hyperledger/cactus-cmd-api-server";
import { IPluginKeychain } from "@hyperledger/cactus-core-api";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { IHtlcAppOptions, ShutdownHook, IStartInfo } from "./htlc-app-types";
export declare class HtlcApp {
    readonly options: IHtlcAppOptions;
    private readonly log;
    private readonly shutdownHooks;
    readonly keychain: IPluginKeychain;
    private _cordaClient?;
    get cordaApiClientOrThrow(): CordaApi;
    constructor(options: IHtlcAppOptions);
    start(): Promise<IStartInfo>;
    stop(): Promise<void>;
    onShutdown(hook: ShutdownHook): void;
    startNode(httpServerApi: Server, //endpoint to hit
    httpServerCockpit: Server, //frontend server?
    pluginRegistry: PluginRegistry): Promise<ApiServer>;
}
