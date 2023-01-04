import { Checks, Logger, LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { ICactusPlugin, IPluginWebService, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { Express } from "express";
import { CreateBondEndpoint } from "./web-services/create-bond-endpoint";

export interface IHtlcCactusPluginOptions {
    logLevel?: LogLevelDesc;
    instanceId: string;
    cordaApi: CordaApi;
    // contracts: ;
}

export class HtlcCactusPlugin implements ICactusPlugin, IPluginWebService {
    public static readonly CLASS_NAME = "HtlcCactusPlugin";

    private readonly log: Logger;
    private readonly instanceId: string;

    private endpoints: IWebServiceEndpoint[] | undefined;

    public get className(): string {
        return HtlcCactusPlugin.CLASS_NAME;
    }

    constructor(public readonly options: IHtlcCactusPluginOptions) {
        const fnTag = `${this.className}#constructor()`;

        Checks.truthy(options, `${fnTag} arg options`);
        Checks.truthy(options.instanceId, `${fnTag} arg options.instanceId`);
        Checks.nonBlankString(options.instanceId, `${fnTag} options.instanceId`);
        // Checks.truthy(options.contracts, `${fnTag} arg options.contracts`);
        Checks.truthy(
            options.cordaApi,
            `${fnTag} arg options.cordaApi`,
        );

        const level = this.options.logLevel || "INFO";
        const label = this.className;
        this.log = LoggerProvider.getOrCreate({ level, label });
        this.instanceId = options.instanceId;
    }

    public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
        if (Array.isArray(this.endpoints)) {
            return this.endpoints;
        }

        const createBond = new CreateBondEndpoint({
            apiClient: this.options.cordaApi
        });

        this.endpoints = [createBond];

        return this.endpoints;
    }

    async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
        const webServices = await this.getOrCreateWebServices();
        await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
        return webServices;
    }

    getOpenApiSpec(): unknown {
        throw new Error("Method not implemented.");
    }

    public async shutdown(): Promise<void> {
        this.log.info(`Shutting down ${this.className}...`);
    }

    public getInstanceId(): string {
        return this.instanceId;
    }

    public getPackageName(): string {
        return "@hyperledger/cactus-example-supply-chain-backend";
    }

    public async onPluginInit(): Promise<unknown> {
        return;
    }

}