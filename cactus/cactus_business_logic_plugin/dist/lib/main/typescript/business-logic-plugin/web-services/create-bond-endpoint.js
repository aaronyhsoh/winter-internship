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
        console.log(req);
        this.log.info("Calling create bond");
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
                                    fqClassName: "java.lang.Double",
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
            console.log("Error!!!");
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