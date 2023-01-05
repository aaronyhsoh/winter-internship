import { IAsyncProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { AuthorizationOptionsProvider } from "@hyperledger/cactus-core";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { Express, Request, Response } from "express";
import OAS from "../../../json/openapi.json";
export interface IGetBondByIdEndpointOptions {
    logLevel?: LogLevelDesc;
    apiClient: CordaApi;
    authorizationOptionsProvider?: AuthorizationOptionsProvider;
}
export declare class GetBondByIdEndpoint implements IWebServiceEndpoint {
    readonly opts: IGetBondByIdEndpointOptions;
    static readonly CLASS_NAME = "GetBondByIdEndpoint";
    private readonly log;
    get className(): string;
    constructor(opts: IGetBondByIdEndpointOptions);
    getOasPath(): typeof OAS.paths["/bond"];
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getVerbLowerCase(): string;
    getPath(): string;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
