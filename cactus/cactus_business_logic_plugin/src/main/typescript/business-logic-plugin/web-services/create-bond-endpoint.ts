import { Express, Request, Response } from "express";
import { LogLevelDesc, Logger, Checks, LoggerProvider, IAsyncProvider,safeStringifyException } from "@hyperledger/cactus-common";
import { DefaultApi as CordaApi, FlowInvocationType } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { IWebServiceEndpoint, IEndpointAuthzOptions, IExpressRequestHandler } from "@hyperledger/cactus-core-api";
import { registerWebServiceEndpoint, AuthorizationOptionsProvider } from "@hyperledger/cactus-core";

export interface ICreateBondEndpointOptions {
    logLevel?: LogLevelDesc;
    apiClient: CordaApi;
    authorizationOptionsProvider?: AuthorizationOptionsProvider;
}

const K_DEFAULT_AUTHORIZATION_OPTIONS: IEndpointAuthzOptions = {
    isProtected: false,
    requiredRoles: [],
};

export class CreateBondEndpoint implements IWebServiceEndpoint {
    public static readonly CLASS_NAME = "CreateBondEndpoint";

    private readonly log: Logger;

    public get className(): string {
        return CreateBondEndpoint.CLASS_NAME;
    }

    private readonly authorizationOptionsProvider: AuthorizationOptionsProvider;

    constructor(public readonly opts: ICreateBondEndpointOptions) {
        const fnTag = `${this.className}constructure()`;
        Checks.truthy(opts, `${fnTag} arg options`);
        Checks.truthy(opts.apiClient, `${fnTag} options.apiClient`);

        const level = this.opts.logLevel;
        const label = this.className;
        this.log = LoggerProvider.getOrCreate({ level, label });
        this.authorizationOptionsProvider =
            opts.authorizationOptionsProvider ||
            AuthorizationOptionsProvider.of(K_DEFAULT_AUTHORIZATION_OPTIONS, level);
        this.log.debug(`Instantiated ${this.className} OK`);
    }

    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions> {
        return this.authorizationOptionsProvider;
    }

    public async registerExpress(
        expressApp: Express,
    ): Promise<IWebServiceEndpoint> {
        await registerWebServiceEndpoint(expressApp, this);
        return this;
    }

    public getVerbLowerCase(): string {
        return 'path';
    }

    public getPath(): string {
        return '/bond/create';
    }

    public getExpressRequestHandler(): IExpressRequestHandler {
        return this.handleRequest.bind(this);
    }

    async handleRequest(req: Request, res: Response) : Promise<void> {
        const tag = `${this.getVerbLowerCase().toUpperCase()} ${this.getPath()}`;
        try {
            const bondId = req.body;
            this.log.debug(`${tag} %o`, bondId);

            const {
                data: { callOutput, transactionId }
            } = await this.opts.apiClient.invokeContractV1({
                flowFullClassName: "com.crosschain.flows.CreateAndIssueBond",
                flowInvocationType: FlowInvocationType.FlowDynamic,
                params: [

                ],
                timeoutMs: 60000,
            })
            
            const body = { callOutput, transactionId };
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