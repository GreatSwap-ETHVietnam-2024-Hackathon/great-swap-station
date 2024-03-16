import { ChainId } from "@biconomy/core-types";
import chains from "./chains";

export interface TokenConfigs {
    name: string,
    imageUrl: string,
    decimals: number,
    addresses: {
        [key: number]: string
    },
    isNativeOf?: number,
    weight: number
}

const defaultConfig: TokenConfigs = {
    decimals: 18,
    addresses: {},
    imageUrl: "/images/tokens/binance.png",
    name: "Token",
    weight: 1
}

export const tokenConfigs: { [key: string]: TokenConfigs } = {
    BUSD: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        },
        name: 'Binance-Peg BUSD',
        imageUrl: "/images/tokens/busd.png",
        weight: 1000
    },
    BNB: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
        },
        isNativeOf: ChainId.BSC_MAINNET,
        name: "Binance",
        imageUrl: "/images/tokens/bnb.png",
        weight: 10000
    },
    TRAVA: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x0391bE54E72F7e001f6BBc331777710b4f2999Ef",
        },
        name: "TravaFinance",
        imageUrl: "/images/tokens/trava.png",
        weight: 100
    },
    DAI: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
        },
        name: "DAI",
        imageUrl: "/images/tokens/dai.png",
        weight: 1000
    },
    USDC: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        },
        name: "USDC",
        imageUrl: "/images/tokens/usdc.png",
        weight: 1000
    },
    USDT: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x55d398326f99059ff775485246999027b3197955",
        },
        name: "USDT",
        imageUrl: "/images/tokens/usdt.png",
        weight: 1000
    },
    ETH: {
        ...defaultConfig,
        isNativeOf: ChainId.MAINNET,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        },
        name: "ETH",
        imageUrl: "/images/tokens/eth.png",
        weight: 1000
    },
    BTCB: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        },
        name: "BTCB",
        imageUrl: "/images/tokens/btc.png",
        weight: 1000
    },
    AAVE: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0xfb6115445bff7b52feb98650c87f44907e58f802",
        },
        name: "AAVE",
        imageUrl: "/images/tokens/aave.png",
        weight: 1000
    },
    ADA: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"
        },
        name: "ADA",
        imageUrl: "/images/tokens/ada.png"
    },
    CAKE: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"
        },
        name: "CAKE",
        imageUrl: "/images/tokens/cake.png"
    },
    XRP: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe"
        },
        name: "XRP",
        imageUrl: "/images/tokens/xrp.png"
    },
    DOGE: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0xba2ae424d960c26247dd6c32edc70b295c744c43"
        },
        name: "DOGE",
        imageUrl: "/images/tokens/doge.png"
    },
    DOT: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x7083609fce4d1d8dc0c979aab8c869ea2c873402"
        },
        name: "DOT",
        imageUrl: "/images/tokens/dot.png"
    },
    XVS: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63"
        },
        name: "XVS",
        imageUrl: "/images/tokens/xvs.png"
    },
    TUSD: {
        ...defaultConfig,
        addresses: {
            [ChainId.BSC_MAINNET]: "0x40af3827f39d0eacbf4a168f8d4ee67c121d11c9"
        },
        name: "Tether-USD",
        imageUrl: "/images/tokens/tusd.png"
    }
}

export const knownTokens = Object.keys(tokenConfigs)
export function getAvailableTokens(chainId: number) {
    const nativeToken = chains[chainId].nativeToken;
    return [nativeToken, ...knownTokens.filter(token => tokenConfigs[token].addresses[chainId] !== undefined)]
}
export const nativeTokens = Object.values(chains).map(chain => chain.nativeToken)