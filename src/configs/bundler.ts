import { Bundler, IBundler } from "@biconomy/bundler";
import ContractAddress from "./contracts";
import { Env } from "src/global.config";


export default function bundler(chainId: number): IBundler {
    return new Bundler({
        bundlerUrl: Env.VITE_APP_BUNDLER_URL,
        chainId,
        entryPointAddress: ContractAddress.EntryPoint
    })
}