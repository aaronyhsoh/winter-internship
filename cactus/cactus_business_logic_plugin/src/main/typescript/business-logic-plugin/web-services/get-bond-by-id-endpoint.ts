import { Checks, IAsyncProvider, Logger, LoggerProvider, LogLevelDesc, safeStringifyException } from "@hyperledger/cactus-common";
import { AuthorizationOptionsProvider, registerWebServiceEndpoint } from "@hyperledger/cactus-core";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { DefaultApi as CordaApi, FlowInvocationType, JvmTypeKind } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { Express, Request, Response } from "express";
import OAS from "../../../json/openapi.json";

export interface IGetBondByIdEndpointOptions {
    logLevel?: LogLevelDesc;
    apiClient: CordaApi;
    authorizationOptionsProvider?: AuthorizationOptionsProvider;
}

export class GetBondByIdEndpoint implements IWebServiceEndpoint {
    public static readonly CLASS_NAME = "GetBondByIdEndpoint";

    private readonly log: Logger;

    public get className(): string {
        return GetBondByIdEndpoint.CLASS_NAME;
    }

    constructor(public readonly opts: IGetBondByIdEndpointOptions) {
        const fnTag = `${this.className}#constructor()`;
        Checks.truthy(opts, `${fnTag} arg options`);
        Checks.truthy(opts.apiClient, `${fnTag} options.apiClient`);

        const level = this.opts.logLevel || "INFO";
        const label = this.className;
        this.log = LoggerProvider.getOrCreate({ level, label });
    }

    public getOasPath(): typeof OAS.paths["/bond"] {
        return OAS.paths["/bond"];
    }

    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions> {
        // TODO: make this an injectable dependency in the constructor
        return {
            get: async () => ({
                isProtected: false,
                requiredRoles: [],
            }),
        };
    }
    public async registerExpress(
        expressApp: Express,
    ): Promise<IWebServiceEndpoint> {
        await registerWebServiceEndpoint(expressApp, this);
        return this;
    }

    public getVerbLowerCase(): string {
        return 'get';
    }

    public getPath(): string {
        return "/bond";
    }

    public getExpressRequestHandler(): IExpressRequestHandler {
        return this.handleRequest.bind(this);
    }


    async handleRequest(req: Request, res: Response): Promise<void> {
        const tag = `${this.getVerbLowerCase().toUpperCase()} ${this.getPath()}`;
        try {
            const request = req.body;
            this.log.debug(`${tag} %o`, request);

            const {
                data: { success, callOutput, transactionId },
            } = await this.opts.apiClient.invokeContractV1({
                flowFullClassName: "com.crosschain.flows.CheckBond.CheckBondById",
                flowInvocationType: FlowInvocationType.FlowDynamic,
                params: [
                    {
                        jvmTypeKind: JvmTypeKind.Primitive,
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
        } catch (ex: unknown) {
            const exStr = safeStringifyException(ex);
            this.log.debug(`${tag} Failed to serve request:`, ex);
            res.status(500);
            res.json({ error: exStr });
        }
    }
}