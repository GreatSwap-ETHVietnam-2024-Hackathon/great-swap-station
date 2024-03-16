import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { BigNumber, ethers, Signer } from "ethers"
import { deployAccounts, getSmartAccountsForEOASigner, isAccountDeployed } from "../account-abstraction/smartAccount";
import { Transaction } from "@biconomy/core-types";
import { makeEcdsaModuleUserOp } from "../account-abstraction/userOp";
import bundler from "../configs/bundler";
import { UserOperation } from "../account-abstraction/userOperation";
import erc20ABI from "../contract-abis/erc20";
import ContractAddress from "src/configs/contracts";
import { AddressZero, ChainId, ChainName, ExplorerURL } from "src/configs/constants";
import { Env } from "src/global.config";
import { AccountName } from "src/types/account-name";
import axios from "axios";

interface WalletContextProps {
    signer?: Signer,
    metamaskAccount?: string,
    provider?: ethers.providers.Web3Provider,
    accountsNum: number,
    smartAccounts: string[],
    accountNames: AccountName[],
    connecting: boolean,
    transfering: boolean,
    deploying: boolean,
    showIntro: boolean,
    setShowIntro: any,
    setAccountsNum: any,
    logout: any,
    isWrongChain: boolean
    switchChain: () => Promise<void>,
    handleConnectMetamask: () => Promise<void>,
    signAndCreateUserOp: (index: number, transactions: Transaction[]) => Promise<UserOperation | undefined>,
    excecuteTransactions: (index: number, transactions: Transaction[]) => Promise<string | undefined>,
    transferToken: (index: number, token: string, amount: BigNumber, recipient: string) => Promise<string | undefined>,
    deployIfNotYetDeployed: (smartAccountsToDeploy: string[]) => Promise<void>
}

const WalletContext = createContext<WalletContextProps>({
    signer: undefined,
    accountsNum: 5,
    smartAccounts: [],
    accountNames: [],
    connecting: false,
    transfering: false,
    deploying: false,
    showIntro: false,
    setShowIntro: undefined,
    setAccountsNum: undefined,
    logout: undefined,
    isWrongChain: false,
    switchChain: async () => { },
    handleConnectMetamask: async () => { },
    signAndCreateUserOp: async (index: number, transactions: Transaction[]) => { return undefined },
    excecuteTransactions: async (index: number, transactions: Transaction[]) => { return undefined },
    transferToken: async () => { return undefined },
    deployIfNotYetDeployed: async () => { }
});

export default function WalletContextWrapper({ children }: { children: React.ReactNode }) {
    const [signer, setSigner] = useState<Signer>();
    const [showIntro, setShowIntro] = useState<boolean>(false)
    const [connecting, setConnecting] = useState<boolean>(false)
    const [transfering, setTransfering] = useState<boolean>(false)
    const [deploying, setDeploying] = useState<boolean>(false);
    const [smartAccounts, setSmartAccounts] = useState<string[]>([])
    const [accountNames, setAccountNames] = useState<AccountName[]>([])
    const [accountsNum, setAccountsNum] = useState<number>(5);
    const [metamaskAccount, setMetamaskAccount] = useState<string>()
    const [isWrongChain, setIsWrongChain] = useState<boolean>(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);

    const fetchAccountNames = useCallback(async () => {
        if (!metamaskAccount || smartAccounts.length === 0) return;
        try {
            const response = await axios.get(`${Env.VITE_APP_BOT_API}account-name`, {
                params: {
                    smartAccountsOwner: metamaskAccount.toLowerCase(),
                    smartAccounts: smartAccounts.map(a => a.toLowerCase())
                },
                paramsSerializer: {
                    indexes: true,
                }
            })
            setAccountNames(response.data)
        } catch (err) {
            setAccountNames(smartAccounts.map(a => ({
                smartAccount: a,
                name: undefined
            })))
        }

    }, [metamaskAccount, smartAccounts])
    const handleConnectMetamask = useCallback(async () => {
        localStorage.setItem("signIn", "true")
        setConnecting(true)
        try {
            //@ts-ignore
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("wallet_requestPermissions", [{
                eth_accounts: {}
            }
            ]);
            const signer = provider.getSigner();
            setSigner(signer)
            const metamaskAccount = await signer.getAddress();
            setMetamaskAccount(metamaskAccount);
            setProvider(provider)
            if (isWrongChain == false) {
                const smartAccounts = await getSmartAccountsForEOASigner(provider, metamaskAccount, accountsNum);
                setSmartAccounts(smartAccounts);
            }
            setConnecting(false)
        } catch (err) {
            setConnecting(false)
            throw err;
        }
    }, [])

    const autoConnect = useCallback(async () => {
        setConnecting(true)
        try {
            //@ts-ignore
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            setSigner(signer)
            setProvider(provider);
            const metamaskAccount = await signer.getAddress();
            if (isWrongChain == false) {
                const smartAccounts = await getSmartAccountsForEOASigner(provider, metamaskAccount, accountsNum);
                setSmartAccounts(smartAccounts);
            }
            setMetamaskAccount(metamaskAccount);

        } catch (err) { }
        setConnecting(false)
    }, [accountsNum])

    const fetchIsWrongChain = useCallback(async () => {
        //@ts-ignore
        const userChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (parseInt(userChainId) !== ChainId) {
            setIsWrongChain(true)
        } else {
            setIsWrongChain(false);
        }
    }, [])

    const switchChain = useCallback(async () => {
        try {
            //@ts-ignore
            await window.ethereum.request({
                "method": "wallet_switchEthereumChain",
                "params": [
                    {
                        "chainId": '0x' + ChainId.toString(16)
                    }
                ]
            });
        } catch (err) {
            //@ts-ignore
            await window.ethereum.request({
                "method": "wallet_addEthereumChain",
                "params": [
                    {
                        "chainId": '0x' + ChainId.toString(16),
                        "chainName": ChainName,
                        "rpcUrls": [
                            "http://localhost:9000"
                        ],
                        "nativeCurrency": {
                            "name": "ETH",
                            "symbol": "ETH",
                            "decimals": 18
                        },
                        "blockExplorerUrls": [
                            ExplorerURL
                        ]
                    }
                ]
            });
            //@ts-ignore
            await window.ethereum.request({
                "method": "wallet_switchEthereumChain",
                "params": [
                    {
                        "chainId": '0x' + ChainId.toString(16)
                    }
                ]
            });
        }
    }, [])
    useEffect(() => {
        try {
            //@ts-ignore
            window.ethereum.on('accountsChanged', async () => {
                //@ts-ignore
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner();
                setSigner(signer)
                const metamaskAccount = await signer.getAddress();
                setMetamaskAccount(metamaskAccount);
                setProvider(provider)
                const smartAccounts = await getSmartAccountsForEOASigner(provider, metamaskAccount, accountsNum);
                setSmartAccounts(smartAccounts)
                setShowIntro(true)
            });

            //@ts-ignore
            window.ethereum.on('chainChanged', async (userChainId: string) => {
                if (parseInt(userChainId) !== ChainId) {
                    setIsWrongChain(true)
                } else {
                    setIsWrongChain(false);
                    await autoConnect()
                }
            });

        } catch (err) {

        }
    }, [accountsNum, autoConnect])
    useEffect(() => {
        fetchAccountNames()
    }, [fetchAccountNames])

    const recalculateSmartAccounts = useCallback(async () => {
        if (!metamaskAccount || !provider) return;
        const smartAccounts = await getSmartAccountsForEOASigner(provider, metamaskAccount, accountsNum);
        setSmartAccounts(smartAccounts)
    }, [accountsNum, metamaskAccount, provider])
    useEffect(() => {
        recalculateSmartAccounts()
        fetchIsWrongChain()
    }, [recalculateSmartAccounts, fetchIsWrongChain])

    const signAndCreateUserOp = useCallback(async (index: number, transactions: Transaction[]) => {
        if (!provider || !signer || smartAccounts.length < index) return;
        return await makeEcdsaModuleUserOp(provider, transactions, smartAccounts[index], signer, ContractAddress.ECDSAModule)
    }, [signer, smartAccounts, provider])

    const excecuteTransactions = useCallback(async (index: number, transactions: Transaction[]) => {
        if (!provider || !signer || smartAccounts.length < index) return;
        await deployIfNotYetDeployed([smartAccounts[index]]);
        const userOp = await makeEcdsaModuleUserOp(provider,
            transactions, smartAccounts[index], signer, ContractAddress.ECDSAModule)
        const userOpResponse = await bundler(ChainId).sendUserOp(userOp)
        try {
            const transactionDetails = await userOpResponse.wait();
            // @ts-ignore
            if (transactionDetails.success === true) {
                const explorerURL = `${ExplorerURL}tx/${transactionDetails.receipt.transactionHash}`
                return explorerURL
            }
        } catch (error: any) {
        }



        throw new Error('Transaction reverted!')
    }, [signer, smartAccounts, provider])

    const transferToken = useCallback(async (index: number, token: string, amount: BigNumber, recipient: string) => {
        setTransfering(true)
        let tx: Transaction
        if (token === AddressZero) {
            tx = {
                to: recipient,
                data: '0x',
                value: amount.toHexString()
            }
        } else {
            // TO-DO: change decimals
            const erc20Interface = new ethers.utils.Interface(erc20ABI)
            tx = {
                to: token,
                data: erc20Interface.encodeFunctionData('transfer', [recipient, amount.toHexString()]),
                value: 0
            }
        }
        const txDetails = await excecuteTransactions(index, [tx])
        setTransfering(false)
        return txDetails

    }, [excecuteTransactions])

    const deployIfNotYetDeployed = useCallback(async (smartAccountsToDeploy: string[]) => {
        if (!signer || !provider) return;

        const indexesToDeploy: number[] = [];
        for (let i = 0; i < smartAccountsToDeploy.length; i++) {

            const index = smartAccounts.findIndex(a => a.toLowerCase() === smartAccountsToDeploy[i].toLowerCase());
            if (index !== -1) {
                const isDeployed = await isAccountDeployed(provider, smartAccountsToDeploy[i]);
                if (!isDeployed) indexesToDeploy.push(index)
            }
        }
        if (indexesToDeploy.length > 0) {
            setDeploying(true)
            try {
                await deployAccounts(signer, indexesToDeploy);
                setDeploying(false);
            } catch (err) {
                setDeploying(false)
                throw err
            }

        }
    }, [smartAccounts, signer, accountsNum])

    const logout = useCallback(() => {
        setSigner(undefined);
        setMetamaskAccount(undefined);
        localStorage.removeItem("signIn")
    }, []);
    useEffect(() => {
        if (localStorage.getItem('signIn') !== null) autoConnect()
    }, [autoConnect])
    return (
        <WalletContext.Provider
            value={{
                accountsNum,
                provider,
                showIntro,
                setShowIntro,
                connecting,
                transfering,
                deploying,
                signer,
                metamaskAccount,
                smartAccounts,
                accountNames,
                isWrongChain,
                switchChain,
                logout,
                setAccountsNum,
                transferToken,
                handleConnectMetamask,
                signAndCreateUserOp,
                excecuteTransactions,
                deployIfNotYetDeployed
            }}>
            {children}
        </WalletContext.Provider>
    )
}



export function useWalletContext() {
    return useContext(WalletContext);
}