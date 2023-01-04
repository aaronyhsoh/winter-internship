"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBondEndpoint = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_plugin_ledger_connector_corda_1 = require("@hyperledger/cactus-plugin-ledger-connector-corda");
const cactus_core_1 = require("@hyperledger/cactus-core");
const K_DEFAULT_AUTHORIZATION_OPTIONS = {
    isProtected: false,
    requiredRoles: [],
};
class CreateBondEndpoint {
    get className() {
        return CreateBondEndpoint.CLASS_NAME;
    }
    constructor(opts) {
        this.opts = opts;
        const fnTag = `${this.className}constructure()`;
        cactus_common_1.Checks.truthy(opts, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(opts.apiClient, `${fnTag} options.apiClient`);
        const level = this.opts.logLevel;
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        this.authorizationOptionsProvider =
            opts.authorizationOptionsProvider ||
                cactus_core_1.AuthorizationOptionsProvider.of(K_DEFAULT_AUTHORIZATION_OPTIONS, level);
        this.log.debug(`Instantiated ${this.className} OK`);
    }
    getAuthorizationOptionsProvider() {
        return this.authorizationOptionsProvider;
    }
    async registerExpress(expressApp) {
        await (0, cactus_core_1.registerWebServiceEndpoint)(expressApp, this);
        return this;
    }
    getVerbLowerCase() {
        return 'path';
    }
    getPath() {
        return '/bond/create';
    }
    getExpressRequestHandler() {
        return this.handleRequest.bind(this);
    }
    async handleRequest(req, res) {
        const tag = `${this.getVerbLowerCase().toUpperCase()} ${this.getPath()}`;
        try {
            const bondId = req.body;
            this.log.debug(`${tag} %o`, bondId);
            const { data: { callOutput, transactionId } } = await this.opts.apiClient.invokeContractV1({
                flowFullClassName: "com.crosschain.flows.CreateAndIssueBond",
                flowInvocationType: cactus_plugin_ledger_connector_corda_1.FlowInvocationType.FlowDynamic,
                params: [],
                timeoutMs: 60000,
            });
            const body = { callOutput, transactionId };
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
exports.CreateBondEndpoint = CreateBondEndpoint;
CreateBondEndpoint.CLASS_NAME = "CreateBondEndpoint";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWJvbmQtZW5kcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2J1c2luZXNzLWxvZ2ljLXBsdWdpbi93ZWItc2VydmljZXMvY3JlYXRlLWJvbmQtZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsOERBQWlJO0FBQ2pJLDRHQUErRztBQUUvRywwREFBb0c7QUFRcEcsTUFBTSwrQkFBK0IsR0FBMEI7SUFDM0QsV0FBVyxFQUFFLEtBQUs7SUFDbEIsYUFBYSxFQUFFLEVBQUU7Q0FDcEIsQ0FBQztBQUVGLE1BQWEsa0JBQWtCO0lBSzNCLElBQVcsU0FBUztRQUNoQixPQUFPLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztJQUN6QyxDQUFDO0lBSUQsWUFBNEIsSUFBZ0M7UUFBaEMsU0FBSSxHQUFKLElBQUksQ0FBNEI7UUFDeEQsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQzVDLHNCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxLQUFLLG9CQUFvQixDQUFDLENBQUM7UUFFNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLDRCQUE0QjtZQUM3QixJQUFJLENBQUMsNEJBQTRCO2dCQUNqQywwQ0FBNEIsQ0FBQyxFQUFFLENBQUMsK0JBQStCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCwrQkFBK0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsNEJBQTRCLENBQUM7SUFDN0MsQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlLENBQ3hCLFVBQW1CO1FBRW5CLE1BQU0sSUFBQSx3Q0FBMEIsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLGdCQUFnQjtRQUNuQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0sT0FBTztRQUNWLE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFTSx3QkFBd0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTtRQUMzQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO1FBQ3pFLElBQUk7WUFDQSxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFcEMsTUFBTSxFQUNGLElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsRUFDdEMsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDO2dCQUMzQyxpQkFBaUIsRUFBRSx5Q0FBeUM7Z0JBQzVELGtCQUFrQixFQUFFLHlEQUFrQixDQUFDLFdBQVc7Z0JBQ2xELE1BQU0sRUFBRSxFQUVQO2dCQUNELFNBQVMsRUFBRSxLQUFLO2FBQ25CLENBQUMsQ0FBQTtZQUVGLE1BQU0sSUFBSSxHQUFHLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxDQUFDO1lBQzNDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQjtRQUFDLE9BQU8sRUFBVyxFQUFFO1lBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUEsc0NBQXNCLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQzs7QUExRUwsZ0RBMkVDO0FBMUUwQiw2QkFBVSxHQUFHLG9CQUFvQixDQUFDIn0=