"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtlcCactusPlugin = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const create_bond_endpoint_1 = require("./web-services/create-bond-endpoint");
class HtlcCactusPlugin {
    get className() {
        return HtlcCactusPlugin.CLASS_NAME;
    }
    constructor(options) {
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(options.instanceId, `${fnTag} arg options.instanceId`);
        cactus_common_1.Checks.nonBlankString(options.instanceId, `${fnTag} options.instanceId`);
        // Checks.truthy(options.contracts, `${fnTag} arg options.contracts`);
        cactus_common_1.Checks.truthy(options.cordaApi, `${fnTag} arg options.cordaApi`);
        const level = this.options.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        this.instanceId = options.instanceId;
    }
    async getOrCreateWebServices() {
        if (Array.isArray(this.endpoints)) {
            return this.endpoints;
        }
        const createBond = new create_bond_endpoint_1.CreateBondEndpoint({
            apiClient: this.options.cordaApi
        });
        this.endpoints = [createBond];
        return this.endpoints;
    }
    async registerWebServices(app) {
        const webServices = await this.getOrCreateWebServices();
        await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
        return webServices;
    }
    getOpenApiSpec() {
        throw new Error("Method not implemented.");
    }
    async shutdown() {
        this.log.info(`Shutting down ${this.className}...`);
    }
    getInstanceId() {
        return this.instanceId;
    }
    getPackageName() {
        return "@hyperledger/cactus-example-supply-chain-backend";
    }
    async onPluginInit() {
        return;
    }
}
exports.HtlcCactusPlugin = HtlcCactusPlugin;
HtlcCactusPlugin.CLASS_NAME = "HtlcCactusPlugin";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRsYy1jYWN0dXMtcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9idXNpbmVzcy1sb2dpYy1wbHVnaW4vaHRsYy1jYWN0dXMtcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUEwRjtBQUkxRiw4RUFBeUU7QUFTekUsTUFBYSxnQkFBZ0I7SUFRekIsSUFBVyxTQUFTO1FBQ2hCLE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxZQUE0QixPQUFpQztRQUFqQyxZQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUN6RCxNQUFNLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLGdCQUFnQixDQUFDO1FBRWhELHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssY0FBYyxDQUFDLENBQUM7UUFDL0Msc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLEtBQUsseUJBQXlCLENBQUMsQ0FBQztRQUNyRSxzQkFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsS0FBSyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3pFLHNFQUFzRTtRQUN0RSxzQkFBTSxDQUFDLE1BQU0sQ0FDVCxPQUFPLENBQUMsUUFBUSxFQUNoQixHQUFHLEtBQUssdUJBQXVCLENBQ2xDLENBQUM7UUFFRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ3pDLENBQUM7SUFFTSxLQUFLLENBQUMsc0JBQXNCO1FBQy9CLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3pCO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSx5Q0FBa0IsQ0FBQztZQUN0QyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxHQUFZO1FBQ2xDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDeEQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxjQUFjO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUTtRQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLGFBQWE7UUFDaEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFTSxjQUFjO1FBQ2pCLE9BQU8sa0RBQWtELENBQUM7SUFDOUQsQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZO1FBQ3JCLE9BQU87SUFDWCxDQUFDOztBQXBFTCw0Q0FzRUM7QUFyRTBCLDJCQUFVLEdBQUcsa0JBQWtCLENBQUMifQ==