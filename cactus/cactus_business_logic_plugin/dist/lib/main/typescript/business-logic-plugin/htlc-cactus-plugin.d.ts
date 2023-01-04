import { LogLevelDesc } from "@hyperledger/cactus-common";
import { ICactusPlugin, IPluginWebService, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { Express } from "express";
export interface IHtlcCactusPluginOptions {
    logLevel?: LogLevelDesc;
    instanceId: string;
    cordaApi: CordaApi;
}
export declare class HtlcCactusPlugin implements ICactusPlugin, IPluginWebService {
    readonly options: IHtlcCactusPluginOptions;
    static readonly CLASS_NAME = "HtlcCactusPlugin";
    private readonly log;
    private readonly instanceId;
    private endpoints;
    get className(): string;
    constructor(options: IHtlcCactusPluginOptions);
    getOrCreateWebServices(): Promise<IWebServiceEndpoint[]>;
    registerWebServices(app: Express): Promise<IWebServiceEndpoint[]>;
    getOpenApiSpec(): unknown;
    shutdown(): Promise<void>;
    getInstanceId(): string;
    getPackageName(): string;
    onPluginInit(): Promise<unknown>;
}
