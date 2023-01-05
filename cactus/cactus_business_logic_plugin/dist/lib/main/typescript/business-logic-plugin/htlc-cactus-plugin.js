"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtlcCactusPlugin = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const create_bond_endpoint_1 = require("./web-services/create-bond-endpoint");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
const get_bond_by_id_endpoint_1 = require("./web-services/get-bond-by-id-endpoint");
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
        const getBondById = new get_bond_by_id_endpoint_1.GetBondByIdEndpoint({
            apiClient: this.options.cordaApi
        });
        this.endpoints = [createBond, getBondById];
        return this.endpoints;
    }
    async registerWebServices(app) {
        const webServices = await this.getOrCreateWebServices();
        await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
        return webServices;
    }
    getOpenApiSpec() {
        return openapi_json_1.default;
    }
    async shutdown() {
        this.log.info(`Shutting down ${this.className}...`);
    }
    getInstanceId() {
        return this.instanceId;
    }
    getPackageName() {
        return "htlc-cactus-backend";
    }
    async onPluginInit() {
        return;
    }
}
exports.HtlcCactusPlugin = HtlcCactusPlugin;
HtlcCactusPlugin.CLASS_NAME = "HtlcCactusPlugin";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRsYy1jYWN0dXMtcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9idXNpbmVzcy1sb2dpYy1wbHVnaW4vaHRsYy1jYWN0dXMtcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUEwRjtBQUkxRiw4RUFBeUU7QUFDekUsMkVBQTBDO0FBQzFDLG9GQUE2RTtBQVE3RSxNQUFhLGdCQUFnQjtJQVF6QixJQUFXLFNBQVM7UUFDaEIsT0FBTyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7SUFDdkMsQ0FBQztJQUVELFlBQTRCLE9BQWlDO1FBQWpDLFlBQU8sR0FBUCxPQUFPLENBQTBCO1FBQ3pELE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFFaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsQ0FBQztRQUMvQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsS0FBSyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JFLHNCQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxLQUFLLHFCQUFxQixDQUFDLENBQUM7UUFDekUsc0VBQXNFO1FBQ3RFLHNCQUFNLENBQUMsTUFBTSxDQUNULE9BQU8sQ0FBQyxRQUFRLEVBQ2hCLEdBQUcsS0FBSyx1QkFBdUIsQ0FDbEMsQ0FBQztRQUVGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDekMsQ0FBQztJQUVNLEtBQUssQ0FBQyxzQkFBc0I7UUFDL0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMvQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDekI7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLHlDQUFrQixDQUFDO1lBQ3RDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsSUFBSSw2Q0FBbUIsQ0FBQztZQUN4QyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO1NBQ25DLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFM0MsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsR0FBWTtRQUNsQyxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQ3hELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRU0sY0FBYztRQUNqQixPQUFPLHNCQUFHLENBQUM7SUFDZixDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQVE7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxhQUFhO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sY0FBYztRQUNqQixPQUFPLHFCQUFxQixDQUFDO0lBQ2pDLENBQUM7SUFFTSxLQUFLLENBQUMsWUFBWTtRQUNyQixPQUFPO0lBQ1gsQ0FBQzs7QUF4RUwsNENBMEVDO0FBekUwQiwyQkFBVSxHQUFHLGtCQUFrQixDQUFDIn0=