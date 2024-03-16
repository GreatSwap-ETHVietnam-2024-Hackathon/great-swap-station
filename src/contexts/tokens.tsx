import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { popularTokens } from "src/configs/popular-tokens";
import { ERC20__factory } from "src/typechain-types/factories/ERC20__factory";
import { useBotSettingsContext } from "./bot-settings";
import { Env } from "src/global.config";
import { BigNumberish } from "ethers";
import { useWalletContext } from "./wallet";
import { Multicall__factory } from "src/typechain-types";
import ContractAddress from "src/configs/contracts";
import { deepClone } from "src/utils/deep-clone";
export interface TokenInfo {
    name: string,
    symbol: string,
    decimals: number,
    imageUrl: string,
    price: BigNumberish
}
type TokenInfoMap = { [key: string]: TokenInfo }

interface TokensContextProps {
    suggestedTokens: TokenInfoMap,
    manuallyAddedTokens: TokenInfoMap,
    findTokenInfo: (tokenAddress: string) => Promise<TokenInfo | undefined>,
    addTokenInfo: (tokenAddress: string, info: TokenInfo) => void,
    moveFromSuggestions: (tokenAddress: string) => void,
    moveAllFromSuggestions: () => void,
    moveFromManual: (tokenAddress: string) => void,
    moveAllFromManual: () => void,
    ETHPrice: number,
    addSuggestedTokenInfo: (tokenAddress: string, info: TokenInfo) => void
}

const TokensContext = createContext<TokensContextProps>({
    suggestedTokens: {},
    manuallyAddedTokens: {},
    findTokenInfo: async () => { return undefined },
    addTokenInfo: () => { },
    moveFromSuggestions: () => { },
    moveAllFromSuggestions: () => { },
    moveFromManual: () => { },
    moveAllFromManual: () => { },
    ETHPrice: 0,
    addSuggestedTokenInfo: () => { }
});

const erc20Interface = ERC20__factory.createInterface();
export default function TokensContextWrapper({ children }: { children: React.ReactNode }) {

    const { currentData } = useBotSettingsContext();
    const [suggestedTokens, setSuggestedTokens] = useState<TokenInfoMap>({})
    const [manuallyAddedTokens, setManuallyAddedTokens] = useState<TokenInfoMap>({})
    const [ETHPrice, setETHPrice] = useState<number>(0);

    const { provider } = useWalletContext();
    const fetchTokenInfo = useCallback(async (tokenAddress: string) => {
    }, [])

    const fetchTokensInfo = useCallback(async () => {
        if (!provider) return;
        const manuallyAddedTokens: TokenInfoMap = {};
        const suggestedTokens: TokenInfoMap = {};
        let calls: {
            target: string;
            allowFailure: boolean;
            callData: string;
        }[] = [];

        const findTokenAddresses = localStorage.getItem('findTokenAddresses');
        let findTokenAddressesArray: string[] = [];
        if (findTokenAddresses) {
            findTokenAddressesArray = JSON.parse(findTokenAddresses);
        }
        else {
            findTokenAddressesArray = popularTokens;
        }

        for (const token of currentData.tokens) {
            calls = [
                ...calls,
                {
                    target: token,
                    allowFailure: false,
                    callData: erc20Interface.encodeFunctionData("name")
                },
                {
                    target: token,
                    allowFailure: false,
                    callData: erc20Interface.encodeFunctionData("symbol")
                },
                {
                    target: token,
                    allowFailure: false,
                    callData: erc20Interface.encodeFunctionData("decimals")
                }
            ]
            if (!findTokenAddressesArray.includes(token.toLowerCase())) {
                findTokenAddressesArray.push(token.toLowerCase());
            }
        }
        localStorage.setItem('findTokenAddresses', JSON.stringify(findTokenAddressesArray));
        const allTokens = [...currentData.tokens.map(t => t.toLowerCase())]
        for (const token of findTokenAddressesArray) {
            if (!currentData.tokens.find(t => t === token.toLowerCase())) {
                calls = [
                    ...calls,
                    {
                        target: token,
                        allowFailure: false,
                        callData: erc20Interface.encodeFunctionData("name")
                    },
                    {
                        target: token,
                        allowFailure: false,
                        callData: erc20Interface.encodeFunctionData("symbol")
                    },
                    {
                        target: token,
                        allowFailure: false,
                        callData: erc20Interface.encodeFunctionData("decimals")
                    }
                ]
                allTokens.push(token.toLowerCase())
            }
        }

        const multicall = Multicall__factory.connect(ContractAddress.Multicall, provider);
        const results = await multicall.callStatic.aggregate3(calls)


        for (let i = 0; i < results.length / 3; i++) {
            const res = results.slice(3 * i, 3 * i + 3);
            const name = erc20Interface.decodeFunctionResult("name", res[0].returnData)[0] as string
            const symbol = erc20Interface.decodeFunctionResult("symbol", res[1].returnData)[0] as string
            const decimals = parseInt(erc20Interface.decodeFunctionResult("decimals", res[2].returnData)[0])

            const info: TokenInfo = {
                name,
                symbol,
                decimals,
                imageUrl: '',
                price: 0
            }
            if (i < currentData.tokens.length)
                manuallyAddedTokens[allTokens[i]] = info
            else
                suggestedTokens[allTokens[i]] = info
        }
        setManuallyAddedTokens(manuallyAddedTokens);
        setSuggestedTokens(suggestedTokens);
    }, [currentData, provider])

    const fetchETHPrice = useCallback(async () => {
        return 0;
    }, [])

    const findTokenInfo = useCallback(async (tokenAddress: string) => {
        tokenAddress = tokenAddress.toLowerCase();
        if (!provider) return;
        if (suggestedTokens[tokenAddress]) return suggestedTokens[tokenAddress]
        if (manuallyAddedTokens[tokenAddress]) return manuallyAddedTokens[tokenAddress];
        try {
            const calls = [
                {
                    target: tokenAddress,
                    allowFailure: false,
                    callData: erc20Interface.encodeFunctionData("name")
                },
                {
                    target: tokenAddress,
                    allowFailure: false,
                    callData: erc20Interface.encodeFunctionData("symbol")
                },
                {
                    target: tokenAddress,
                    allowFailure: false,
                    callData: erc20Interface.encodeFunctionData("decimals")
                }
            ]
            const multicall = Multicall__factory.connect(ContractAddress.Multicall, provider);
            const results = await multicall.callStatic.aggregate3(calls)
            const name = erc20Interface.decodeFunctionResult("name", results[0].returnData)[0] as string
            const symbol = erc20Interface.decodeFunctionResult("symbol", results[1].returnData)[0] as string
            const decimals = parseInt(erc20Interface.decodeFunctionResult("decimals", results[2].returnData)[0])
            let info: TokenInfo = {
                name, symbol, decimals, imageUrl: '', price: 0
            }
            return info
        } catch (err) {

        }
    }, [suggestedTokens, manuallyAddedTokens, fetchTokenInfo])

    const addSuggestedTokenInfo = useCallback((tokenAddress: string, info: TokenInfo) => {
        setSuggestedTokens(pre => {
            if (!manuallyAddedTokens[tokenAddress])
                pre[tokenAddress] = info
            return deepClone(pre)
        })

    }, [manuallyAddedTokens, suggestedTokens])
    const addTokenInfo = useCallback((tokenAddress: string, info: TokenInfo) => {
        tokenAddress = tokenAddress.toLowerCase();
        setManuallyAddedTokens(pre => deepClone({
            ...pre,
            [tokenAddress]: info
        }))
        setSuggestedTokens(pre => {
            if (pre[tokenAddress])
                delete pre[tokenAddress]
            return deepClone(pre)
        })

    }, [manuallyAddedTokens, suggestedTokens])
    const moveFromSuggestions = useCallback((tokenAddress: string) => {
        setManuallyAddedTokens(pre => deepClone({
            ...pre,
            [tokenAddress]: suggestedTokens[tokenAddress]
        }))
        setSuggestedTokens(pre => {
            delete pre[tokenAddress]
            return deepClone(pre)
        })

    }, [manuallyAddedTokens, suggestedTokens])

    const moveAllFromSuggestions = useCallback(() => {
        setManuallyAddedTokens(pre => {
            Object.assign(pre, suggestedTokens)
            return deepClone(pre)
        })
        setSuggestedTokens({})
    }, [manuallyAddedTokens, suggestedTokens])

    const moveFromManual = useCallback((tokenAddress: string) => {
        setSuggestedTokens(pre => deepClone({
            ...pre,
            [tokenAddress]: manuallyAddedTokens[tokenAddress]
        }))
        setManuallyAddedTokens(pre => {
            delete pre[tokenAddress]
            return deepClone(pre)
        })

    }, [manuallyAddedTokens, suggestedTokens])

    const moveAllFromManual = useCallback(() => {
        setSuggestedTokens(pre => {
            Object.assign(pre, manuallyAddedTokens)
            return deepClone(pre)
        })
        setManuallyAddedTokens({})
    }, [manuallyAddedTokens, suggestedTokens])


    useEffect(() => {
        fetchETHPrice();
        fetchTokensInfo();
    }, [currentData])
    return (
        <TokensContext.Provider
            value={{
                suggestedTokens,
                manuallyAddedTokens,
                findTokenInfo,
                addTokenInfo,
                moveFromSuggestions,
                moveAllFromSuggestions,
                moveFromManual,
                moveAllFromManual,
                ETHPrice,
                addSuggestedTokenInfo
            }}>
            {children}
        </TokensContext.Provider>
    )
}



export function useTokensContext() {
    return useContext(TokensContext);
}