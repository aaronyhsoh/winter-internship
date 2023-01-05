"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBondEndpoint = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_plugin_ledger_connector_corda_1 = require("@hyperledger/cactus-plugin-ledger-connector-corda");
const cactus_core_1 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../../json/openapi.json"));
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
    getOasPath() {
        return openapi_json_1.default.paths["/bond/create"];
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
            const request = req.body;
            this.log.debug(`${tag} %o`, request);
            const { data: { callOutput, transactionId } } = await this.opts.apiClient.invokeContractV1({
                flowFullClassName: "com.crosschain.flows.CreateAndIssueBond.CreateAndIssueBondInitiator",
                flowInvocationType: cactus_plugin_ledger_connector_corda_1.FlowInvocationType.FlowDynamic,
                params: [
                    {
                        jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Reference,
                        jvmType: {
                            fqClassName: "com.crosschain.states.Bond",
                        },
                        jvmCtorArgs: [
                            {
                                jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Primitive,
                                jvmType: {
                                    fqClassName: "java.lang.String",
                                },
                                primitiveValue: request.bondName,
                            },
                            {
                                jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Primitive,
                                jvmType: {
                                    fqClassName: "java.lang.Long",
                                },
                                primitiveValue: request.faceValue,
                            },
                            {
                                jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Primitive,
                                jvmType: {
                                    fqClassName: "java.lang.Long",
                                },
                                primitiveValue: request.couponRate,
                            },
                            {
                                jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Primitive,
                                jvmType: {
                                    fqClassName: "java.lang.Long",
                                },
                                primitiveValue: request.yearsToMature,
                            },
                            {
                                jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Primitive,
                                jvmType: {
                                    fqClassName: "java.lang.Long",
                                },
                                primitiveValue: request.paymentInterval,
                            },
                            {
                                jvmTypeKind: cactus_plugin_ledger_connector_corda_1.JvmTypeKind.Primitive,
                                jvmType: {
                                    fqClassName: "java.lang.String",
                                },
                                primitiveValue: request.holder,
                            },
                        ],
                    }
                ],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWJvbmQtZW5kcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2J1c2luZXNzLWxvZ2ljLXBsdWdpbi93ZWItc2VydmljZXMvY3JlYXRlLWJvbmQtZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsOERBQWlJO0FBQ2pJLDRHQUE0SDtBQUU1SCwwREFBb0c7QUFDcEcsOEVBQTZDO0FBUTdDLE1BQU0sK0JBQStCLEdBQTBCO0lBQzNELFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGFBQWEsRUFBRSxFQUFFO0NBQ3BCLENBQUM7QUFFRixNQUFhLGtCQUFrQjtJQUszQixJQUFXLFNBQVM7UUFDaEIsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7SUFDekMsQ0FBQztJQUlELFlBQTRCLElBQWdDO1FBQWhDLFNBQUksR0FBSixJQUFJLENBQTRCO1FBQ3hELE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsQ0FBQztRQUM1QyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDO1FBRTVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyw0QkFBNEI7WUFDN0IsSUFBSSxDQUFDLDRCQUE0QjtnQkFDakMsMENBQTRCLENBQUMsRUFBRSxDQUFDLCtCQUErQixFQUFF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