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
        const level = "DEBUG";
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
                logLevel: this.options.logLevel || "DEBUG",
            });
        }
        this.log.info("KeychainID=%o", this.keychain.getKeychainId());
        this.shutdownHooks = [];
    }
    async start() {
        this.log.debug(`Starting HtlcApp...`);
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
        const rpcApiHostA = `http://localhost:10006`; // corda node address
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
        properties.cockpitEnabled = false;
        properties.cockpitHost = addressInfoCockpit.address;
        properties.cockpitPort = addressInfoCockpit.port;
        properties.grpcPort = 0; // TODO - make this configurable as well
        properties.logLevel = "DEBUG";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRsYy1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaHRsYy1hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQW9DO0FBSXBDLDBEQUEwRDtBQUUxRCw4REFJb0M7QUFFcEMsOEVBQThFO0FBSzlFLDRHQUF1SDtBQUN2SCw4RkFBa0Y7QUFJbEYsc0VBQXVFO0FBRXZFLCtCQUFpRjtBQUVqRixNQUFhLE9BQU87SUFNbEIsSUFBVyxxQkFBcUI7UUFDOUIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztTQUMxQjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0gsQ0FBQztJQUNELFlBQW1DLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQzFELE1BQU0sS0FBSyxHQUFHLHNCQUFzQixDQUFDO1FBRXJDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUU3QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV4RCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztTQUMxRDthQUFNO1lBQ0wsSUFBSSxD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