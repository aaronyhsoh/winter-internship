"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBondByIdEndpoint = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_plugin_ledger_connector_corda_1 = require("@hyperledger/cactus-plugin-ledger-connector-corda");
const openapi_json_1 = __importDefault(require("../../../json/openapi.json"));
class GetBondByIdEndpoint {
    get className() {
        return GetBondByIdEndpoint.CLASS_NAME;
    }
    constructor(opts) {
        this.opts = opts;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(opts, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(opts.apiClient, `${fnTag} options.apiClient`);
        const level = this.opts.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
    }
    getOasPath() {
        return openapi_json_1.default.paths["/bond"];
    }
    getAuthorizationOptionsProvider() {
        // TODO: make this an injectable dependency in the constructor
        return {
            get: async () => ({
                isProtected: false,
                requiredRoles: [],
            }),
        };
    }
    async registerExpress(expressApp) {
        await (0, cactus_core_1.registerWebServiceEndpoint)(expressApp, this);
        return this;
    }
    getVerbLowerCase() {
        return 'get';
    }
    getPath() {
        return "/bond";
    }
    getExpressRequestHandler() {
        return this.handleRequest.bind(this);
    }
    async handleRequest(req, res) {
        this.log.debug("Calling get bond by id");
        const tag = `${this.getVerbLowerCase().toUpperCase()} ${this.getPath()}`;
        try {
            const request = req.body;
            this.log.debug(`${tag} %o`, request);
            const { data: { success, callOutput, transactionId }, } = await this.opts.apiClient.invokeContractV1({
                flowFullClassName: "com.crosschain.flows.CheckBond.CheckBondById",
                flowInvocationType: cactus_plugin_ledger_connector_corda_1.FlowInvocationType.FlowDynamic,
                params: [
                    {
                        jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Primitive,
                        jvmType: {
                            fqClassName: "java.lang.String",
                        },
                        primitiveValue: request.bondId,
                    }
                ],
                timeoutMs: 60000,
            });
            const body = { success, callOutput, transactionId };
            res.status(200);
            res.json(body);
        }
        catch (ex) {
            const exStr = (0, cactus_common_1.safeStringifyException)(ex);
            this.log.debug(`${tag} Failed to serve request:`, ex);
            res.status(500);
            res.json({ error: exStr });
        }
    }
}
exports.GetBondByIdEndpoint = GetBondByIdEndpoint;
GetBondByIdEndpoint.CLASS_NAME = "GetBondByIdEndpoint";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJvbmQtYnktaWQtZW5kcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2J1c2luZXNzLWxvZ2ljLXBsdWdpbi93ZWItc2VydmljZXMvZ2V0LWJvbmQtYnktaWQtZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOERBQWtJO0FBQ2xJLDBEQUFvRztBQUVwRyw0R0FBNEg7QUFFNUgsOEVBQTZDO0FBUTdDLE1BQWEsbUJBQW1CO0lBSzVCLElBQVcsU0FBUztRQUNoQixPQUFPLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBNEIsSUFBaUM7UUFBakMsU0FBSSxHQUFKLElBQUksQ0FBNkI7UUFDekQsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQzVDLHNCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxLQUFLLG9CQUFvQixDQUFDLENBQUM7UUFFNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQzNDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxVQUFVO1FBQ2IsT0FBTyxzQkFBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsK0JBQStCO1FBQzNCLDhEQUE4RDtRQUM5RCxPQUFPO1lBQ0gsR0FBRyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDZCxXQUFXLEVBQUUsS0FBSztnQkFDbEIsYUFBYSxFQUFFLEVBQUU7YUFDcEIsQ0FBQztTQUNMLENBQUM7SUFDTixDQUFDO0lBQ00sS0FBSyxDQUFDLGVBQWUsQ0FDeEIsVUFBbUI7UUFFbkIsTUFBTSxJQUFBLHdDQUEwQixFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sZ0JBQWdCO1FBQ25CLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxPQUFPO1FBQ1YsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVNLHdCQUF3QjtRQUMzQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFHRCxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhO1FBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDekMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztRQUN6RSxJQUFJO1lBQ0EsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXJDLE1BQU0sRUFDRixJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxHQUMvQyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzNDLGlCQUFpQixFQUFFLDhDQUE4QztnQkFDakUsa0JBQWtCLEVBQUUseURBQWtCLENBQUMsV0FBVztnQkFDbEQsTUFBTSxFQUFFO29CQUNKO3dCQUNJLFdBQVcsRUFBRSxrREFBVyxDQUFDLFNBQVM7d0JBQ2xDLE9BQU8sRUFBRTs0QkFDTCxXQUFXLEVBQUUsa0JBQWtCO3lCQUNsQzt3QkFDRCxjQUFjLEVBQUUsT0FBTyxDQUFDLE1BQU07cUJBQ2pDO2lCQUNKO2dCQUNELFNBQVMsRUFBRSxLQUFLO2FBQ25CLENBQUMsQ0FBQztZQUVILE1BQU0sSUFBSSxHQUFHLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsQ0FBQztZQUNwRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7UUFBQyxPQUFPLEVBQVcsRUFBRTtZQUNsQixNQUFNLEtBQUssR0FBRyxJQUFBLHNDQUFzQixFQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRywyQkFBMkIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM5QjtJQUNMLENBQUM7O0FBckZMLGtEQXNGQztBQXJGMEIsOEJBQVUsR0FBRyxxQkFBcUIsQ0FBQyJ9