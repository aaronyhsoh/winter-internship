import { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { IWebServiceEndpoint, IEndpointAuthzOptions, IExpressRequestHandler } from "@hyperledger/cactus-core-api";
import { AuthorizationOptionsProvider } from "@hyperledger/cactus-core";
import OAS from "../../../json/openapi.json";
export interface ICreateBondEndpointOptions {
    logLevel?: LogLevelDesc;
    apiClient: CordaApi;
    authorizationOptionsProvider?: AuthorizationOptionsProvider;
}
export declare class CreateBondEndpoint implements IWebServiceEndpoint {
    readonly opts: ICreateBondEndpointOptions;
    static readonly CLASS_NAME = "CreateBondEndpoint";
    private readonly log;
    get className(): string;
    private readonly authorizationOptionsProvider;
    constructor(opts: ICreateBondEndpointOptions);
    getOasPath(): typeof OAS.paths["/bond/create"];
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getVerbLowerCase(): string;
    getPath(): string;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
