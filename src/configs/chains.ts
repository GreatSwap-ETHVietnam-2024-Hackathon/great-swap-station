import { ChainId } from "@biconomy/core-types"
import { ethers } from "ethers"

export const supportedChains = [ChainId.BSC_MAINNET]


export interface Chain {
    name: string,
    rpcURL: string,
    explorerURL: string,
    nativeToken: string,
    userOpReceiptIntervals: number,
    isMainnet: boolean,
    bundlerUrl: string,
    imageUrl: string,
    acceptedFees: string[],
    apiName: string,
}
const chains: { [key: number]: Chain } = {
    [ChainId.BSC_MAINNET as number]: {
        name: 'BSC Mainnet',
        rpcURL: "https://rpc.ankr.com/bsc",
        explorerURL: "https://bscscan.com",
        nativeToken: "BNB",
        userOpReceiptIntervals: 5000,
        isMainnet: true,
        // bundlerUrl: `https://api.pimlico.io/v1/binance/rpc?apikey=${process.env.BUNDLER_API_KEY}`
        bundlerUrl: 'https://bundler.biconomy.io/api/v2/56/nji893Ts.hJiogYh-iJkl-45ic-jkHy-hjUif74byUio',
        // bundlerUrl: `https://api.stackup.sh/v1/node/41639b1243a11b6e2419f52cd6b589aebe5764b5384b58c0621e2dfdeaae23e0`,
        imageUrl: "/images/networks/BNB.png",
        acceptedFees: ['BNB'],
        apiName: 'bsc'
    },
}

export default chains
export const defaultChain = chains[ChainId.BSC_MAINNET]
export const defaultChainId = ChainId.BSC_MAINNET
export function getProvider(chainId: number) {
    return new ethers.providers.JsonRpcProvider(chains[chainId].rpcURL)
}