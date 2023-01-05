"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtlcApp = void 0;
const uuid_1 = require("uuid");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_cmd_api_server_1 = require("@hyperledger/cactus-cmd-api-server");
const cactus_plugin_ledger_connector_corda_1 = require("@hyperledger/cactus-plugin-ledger-connector-corda");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const async_exit_hook_1 = __importDefault(require("async-exit-hook"));
const link_1 = require("link");
class HtlcApp {
    get cordaApiClientOrThrow() {
        if (this._cordaClient) {
            return this._cordaClient;
        }
        else {
            throw new Error("Invalid state: ledgers were not started yet.");
        }
    }
    constructor(options) {
        this.options = options;
        const fnTag = "HtlcAppconstructor()";
        if (!options) {
            throw new Error(`${fnTag} options parameter is falsy`);
        }
        const { logLevel } = options;
        const level = logLevel || "INFO";
        const label = "htlc-app";
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        if (this.options.keychain) {
            this.keychain = this.options.keychain;
            this.log.info("Reusing the provided keychain plugin...");
        }
        else {
            this.log.info("Instantiating new keychain plugin...");
            this.keychain = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
                instanceId: (0, uuid_1.v4)(),
                keychainId: (0, uuid_1.v4)(),
                logLevel: this.options.logLevel || "INFO",
            });
        }
        this.log.info("KeychainID=%o", this.keychain.getKeychainId());
        this.shutdownHooks = [];
    }
    async start() {
        this.log.debug(`Starting SupplyChainApp...`);
        if (!this.options.disableSignalHandlers) {
            (0, async_exit_hook_1.default)((callback) => {
                this.stop().then(callback);
            });
            this.log.debug(`Registered signal handlers for graceful auto-shutdown`);
        }
        // Reserve ports where cactus nodes will run api servers that frontend calls
        const httpApiA = await cactus_common_1.Servers.startOnPort(4000, "0.0.0.0");
        //frontend?
        const httpGuiA = await cactus_common_1.Servers.startOnPort(3000, "0.0.0.0");
        const addressInfoA = httpApiA.address();
        const nodeApiHostA = `http://localhost:${addressInfoA.port}`;
        // ==================================================================
        const cordaConfig = new link_1.Configuration({
            basePath: nodeApiHostA,
        });
        const cordaApiClient = new cactus_plugin_ledger_connector_corda_1.DefaultApi(cordaConfig);
        this.log.info(`Configuring Cactus Node for Corda...`);
        const rpcApiHostA = `http://localhost:10006`; // corda api address
        const pluginRegistryA = new cactus_core_1.PluginRegistry({
            plugins: [
                // add business logic plugin
                new link_1.HtlcCactusPlugin({
                    logLevel: this.options.logLevel,
                    cordaApi: cordaApiClient,
                    instanceId: (0, uuid_1.v4)()
                })
            ]
        });
        const sshConfigAdminShell = {
            host: "localhost",
            port: 10006,
            username: "user1",
            password: "test",
        };
        const connectorCorda = new cactus_plugin_ledger_connector_corda_1.PluginLedgerConnectorCorda({
            instanceId: "CordaLedgerPlugin",
            apiUrl: rpcApiHostA,
            sshConfigAdminShell: sshConfigAdminShell,
            corDappsDir: ""
        });
        pluginRegistryA.add(connectorCorda);
        const apiServerA = await this.startNode(httpApiA, httpGuiA, pluginRegistryA);
        return {
            apiServerA,
            cordaApiClient,
            htlcApiClientA: new link_1.DefaultApi(new link_1.Configuration({
                basePath: nodeApiHostA
            }))
        };
    }
    async stop() {
        for (const hook of this.shutdownHooks) {
            await hook(); // FIXME add timeout here so that shutdown does not hang
        }
    }
    onShutdown(hook) {
        this.shutdownHooks.push(hook);
    }
    // start cactus node
    async startNode(httpServerApi, //endpoint to hit
    httpServerCockpit, //frontend server?
    pluginRegistry) {
        const addressInfoApi = httpServerApi.address();
        const addressInfoCockpit = httpServerCockpit.address();
        const configService = new cactus_cmd_api_server_1.ConfigService();
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
        const apiServer = new cactus_cmd_api_server_1.ApiServer({
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
exports.HtlcApp = HtlcApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRsYy1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaHRsYy1hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQW9DO0FBSXBDLDBEQUEwRDtBQUUxRCw4REFJb0M7QUFFcEMsOEVBQThFO0FBSzlFLDRHQUF1SDtBQUN2SCw4RkFBa0Y7QUFJbEYsc0VBQXVFO0FBRXZFLCtCQUFpRjtBQUVqRixNQUFhLE9BQU87SUFNbEIsSUFBVyxxQkFBcUI7UUFDOUIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztTQUMxQjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0gsQ0FBQztJQUNELFlBQW1DLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQzFELE1BQU0sS0FBSyxHQUFHLHNCQUFzQixDQUFDO1FBRXJDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUU3QixNQUFNLEtBQUssR0FBRyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFeEQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDMUQ7YUFBTTtZ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