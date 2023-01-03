import { v4 as uuidv4 } from "uuid";
import { Server } from "http";
import { AddressInfo } from "net";

import { PluginRegistry } from "@hyperledger/cactus-core";

import {
  Logger,
  LoggerProvider,
  Servers
} from "@hyperledger/cactus-common";

import { ApiServer, ConfigService } from "@hyperledger/cactus-cmd-api-server";

// maining to define interfaces with this package
import { Configuration, IPluginKeychain } from "@hyperledger/cactus-core-api";

import { PluginLedgerConnectorCorda, DefaultApi as CordaApi, IPluginLedgerConnectorCordaOptions } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";

import { IHtlcAppOptions, ShutdownHook, IStartInfo } from "./htlc-app-types";

import exitHook, { IAsyncExitHookDoneCallback } from "async-exit-hook";

export class HtlcApp {
  private readonly log: Logger;
  private readonly shutdownHooks: ShutdownHook[];
  public readonly keychain: IPluginKeychain;
  private _cordaClient?: CordaApi;

  public get cordaApiClientOrThrow(): CordaApi {
    if (this._cordaClient) {
      return this._cordaClient;
    } else {
      throw new Error("Invalid state: ledgers were not started yet.");
    }
  }
  public constructor(public readonly options : IHtlcAppOptions) {
    const fnTag = "HtlcAppconstructor()";

    if (!options) {
      throw new Error(`${fnTag} options parameter is falsy`);
    }

    const { logLevel } = options;

    const level = logLevel || "INFO";
    const label = "htlc-app";
    this.log = LoggerProvider.getOrCreate({ level, label });

    if (this.options.keychain) {
      this.keychain = this.options.keychain;
      this.log.info("Reusing the provided keychain plugin...");
    } else {
      this.log.info("Instantiating new keychain plugin...");
      this.keychain = new PluginKeychainMemory({
        instanceId: uuidv4(),
        keychainId: uuidv4(),
        logLevel: this.options.logLevel || "INFO",
      });
    }
    this.log.info("KeychainID=%o", this.keychain.getKeychainId());
    this.shutdownHooks = [];
  }

  public async start(): Promise<IStartInfo> {
    this.log.debug(`Starting SupplyChainApp...`);

    if (!this.options.disableSignalHandlers) {
      exitHook((callback: IAsyncExitHookDoneCallback) => {
        this.stop().then(callback);
      });
      this.log.debug(`Registered signal handlers for graceful auto-shutdown`);
    }

    // Reserve ports where cactus nodes will run api servers that frontend will call
    const httpApiA = await Servers.startOnPort(4000, "0.0.0.0"); 
    const httpGuiA = await Servers.startOnPort(3000, "0.0.0.0");

    const addressInfoA = httpApiA.address() as AddressInfo;
    const nodeApiHostA = `http://localhost:${addressInfoA.port}`;

    const cordaConfig = new Configuration({
      basePath: nodeApiHostA,
    });

    const cordaApiClient = new CordaApi(cordaConfig);

    this.log.info(`Configuring Cactus Node for Corda...`);
    const rpcApiHostA = `http://localhost:10051`; // corda api address

    const pluginRegistryA = new PluginRegistry({
      plugins: [
        // add business logic plugin
      ]
    });

    const sshConfigAdminShell = {
      host: "localhost",
      port: 10006,
      username: "user1",
      password: "test",

    }
    const connectorCorda = new PluginLedgerConnectorCorda({
      instanceId: "CordaLedgerPlugin",
      apiUrl: rpcApiHostA,
      sshConfigAdminShell: sshConfigAdminShell,
      corDappsDir: ""
    });

    pluginRegistryA.add(connectorCorda);

    const apiServerA = await this.startNode(httpApiA, httpGuiA, pluginRegistryA);

    return {
      apiServerA,
      cordaApiClient
    }
  }

  public async stop(): Promise<void> {
    for (const hook of this.shutdownHooks) {
      await hook(); // FIXME add timeout here so that shutdown does not hang
    }
  }

  public onShutdown(hook: ShutdownHook): void {
    this.shutdownHooks.push(hook);
  }

  // start cactus node
  public async startNode(
    httpServerApi: Server, //endpoint to hit
    httpServerCockpit: Server, //frontend server?
    pluginRegistry: PluginRegistry,
  ): Promise<ApiServer> {
    const addressInfoApi = httpServerApi.address() as AddressInfo;
    const addressInfoCockpit = httpServerCockpit.address() as AddressInfo;

    const configService = new ConfigService();
    const config = await configService.getOrCreate();
    const properties = config.getProperties();

    properties.plugins = [];
    properties.configFile = "";
    properties.apiPort = addressInfoApi.port;
    properties.apiHost = addressInfoApi.address;
    properties.cockpitEnabled = true;
    properties.cockpitHost = addressInfoCockpit.address;
    properties.cockpitPort = addressInfoCockpit.port;
    properties.grpcPort = 0; // TODO - make this configurable as well
    properties.logLevel = this.options.logLevel || "INFO";

    const apiServer = new ApiServer({
      config: properties,
      httpServerApi,
      httpServerCockpit,
      pluginRegistry,
    });

    this.onShutdown(() => apiServer.shutdown());

    await apiServer.start();

    return apiServer;
  }
}