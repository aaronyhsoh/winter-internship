import { ApiServer } from "@hyperledger/cactus-cmd-api-server";
import { DefaultApi as CordaApi } from "@hyperledger/cactus-plugin-ledger-connector-corda";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { IPluginKeychain } from "@hyperledger/cactus-core-api";

export interface IStartInfo {
    readonly apiServerA: ApiServer;
    // readonly apiServerB: ApiServer;
    readonly cordaApiClient: CordaApi;
    // readonly ethApiClient: QuorumApi;
    // readonly htlcApiClientA: SupplyChainApi;
    // readonly htlcApiClientB: SupplyChainApi;
}

export interface IHtlcAppOptions {
    disableSignalHandlers?: true;
    logLevel?: LogLevelDesc;
    keychain?: IPluginKeychain;
}

export type ShutdownHook = () => Promise<void>;
  