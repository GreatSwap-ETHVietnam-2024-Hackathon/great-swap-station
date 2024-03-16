import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWalletContext } from "./wallet";
import axios from "axios";
import { commitSessionData } from "../session-key-module/commit-session-data";
import { Env } from "src/global.config";
import { Approval } from "src/types/approval";
import { are2ArraysEqual } from "src/utils/compare-arrays";
import { AddressZero } from "src/configs/constants";
import { isValidTelegramId } from "src/utils/telegram-id";
import { deepClone } from "src/utils/deep-clone";

const baseURL = Env.VITE_APP_BOT_API!
const emptyApproval: Approval = {
    telegramId: 0,
    smartAccountsOwner: '',
    connected: true,
    smartAccounts: [],
    tokens: [],
    locked: false
}
const addressComparison = (a: string, b: string) => a.toLowerCase() < b.toLowerCase() ? -1 : 1;

interface BotSettingsContextProps {
    isLocked: boolean,
    telegramUsername?: string,
    toggleLock: () => void,
    currentData: Approval,
    setCurrentData: any,
    originalData: Approval,
    fetchWhitelistData: () => Promise<void>,
    cancelChanges: () => void,
    saveChanges: () => Promise<void>,
    isDataUnchanged: boolean,
    isLoadingData: boolean,
    isUpdatingData: boolean,
    isUserOnboarded: boolean,
    labelUserAsOnboarded: () => void,
    labelUserAsNew: () => void,
    persistTelegramId: (telegramId: any) => void,
    getTelegramId: () => string | null
}

const BotSettingsContext = createContext<BotSettingsContextProps>({
    isLocked: false,
    toggleLock: () => { },
    currentData: emptyApproval,
    originalData: emptyApproval,
    setCurrentData: () => { },
    fetchWhitelistData: async () => { },
    saveChanges: async () => { },
    isDataUnchanged: true,
    isLoadingData: false,
    isUpdatingData: false,
    isUserOnboarded: false,
    labelUserAsOnboarded: () => { },
    labelUserAsNew: () => { },
    getTelegramId: () => null,
    cancelChanges: () => null,
    persistTelegramId: () => { }
});
export default function BotSettingsContextWrapper({ children }: { children: React.ReactNode }) {
    const { metamaskAccount, signer, deployIfNotYetDeployed } = useWalletContext()
    const [isUpdatingData, setIsUpdatingData] = useState<boolean>(false)
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [telegramId, setTelegramId] = useState<string>(getTelegramId() ?? '')
    const [isUserOnboarded, setIsUserOnboarded] = useState<boolean>(Boolean(localStorage.getItem("onboarded")));
    const [originalData, setOriginalData] = useState<Approval>(emptyApproval);
    const [currentData, setCurrentData] = useState<Approval>(emptyApproval);
    const [telegramUsername, setTelegramUsername] = useState<string | undefined>();

    const labelUserAsOnboarded = () => {
        setIsUserOnboarded(true);
        localStorage.setItem("onboarded", "true");
    };

    const labelUserAsNew = () => {
        setIsUserOnboarded(false);
        localStorage.removeItem("onboarded");
    };

    const defaultApproval = useMemo<Approval>(() => {
        return {
            ...emptyApproval,
            smartAccountsOwner: metamaskAccount ?? AddressZero,
            telegramId: parseInt(getTelegramId() ?? '0'),
        }
    }, [metamaskAccount, telegramId])

    const fetchWhitelistData = useCallback(async () => {
        if (!metamaskAccount) return;
        const telegramId = getTelegramId();
        if (!telegramId) return;
        setIsLoadingData(true);

        try {
            const sessionRes = await axios.get(`${baseURL}approval?telegramId=${telegramId}&smartAccountsOwner=${metamaskAccount}`)
            setOriginalData(deepClone(sessionRes.data));
            setCurrentData(deepClone(sessionRes.data))
        } catch (err) {
            console.log(defaultApproval);
            setOriginalData(deepClone({ ...defaultApproval, smartAccounts: [] }));
            setCurrentData(deepClone(defaultApproval));
        }

        setIsLoadingData(false)
    }
        , [metamaskAccount, defaultApproval])

    const isDataUnchanged = useMemo(() => {
        return originalData.locked === currentData.locked &&
            originalData.telegramId === currentData.telegramId &&
            are2ArraysEqual(deepClone(originalData.tokens), deepClone(currentData.tokens), undefined, addressComparison) &&
            are2ArraysEqual(deepClone(originalData.smartAccounts), deepClone(currentData.smartAccounts), undefined, addressComparison)
    }, [originalData, currentData])

    const isLocked = useMemo(() => {
        return currentData?.locked ?? false
    }, [currentData])


    const toggleLock = useCallback(() => {
        setCurrentData(pre => deepClone({
            ...pre,
            locked: !pre.locked
        }))
    }, [setCurrentData])

    const fetchTelegramUserInfo = useCallback(async () => {
        try {
            if (isValidTelegramId(telegramId)) {
                const result = await axios.get(`${baseURL}telegram-user?telegramId=${telegramId}`)
                const user = result.data
                setTelegramUsername(user.username);
            } else setTelegramUsername(undefined);
        } catch (err) {
            setTelegramUsername(undefined);
        }
    }, [telegramId])

    useEffect(() => {
        fetchTelegramUserInfo();
    }, [fetchTelegramUserInfo])
    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            if (!isDataUnchanged) {
                try {
                    const userConfirmation = window.confirm("The page has not been saved. Are you sure you want to exit?");

                    if (!userConfirmation) {
                        event.preventDefault();
                        event.returnValue = '';
                    }
                } catch (error) {

                }
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDataUnchanged]);

    const saveChanges = useCallback(async () => {
        const telegramId = getTelegramId()
        if (!telegramId) return
        setIsUpdatingData(true)

        try {
            await deployIfNotYetDeployed(currentData.smartAccounts);
            if (signer && telegramId && metamaskAccount) {
                if (!isDataUnchanged) {
                    await commitSessionData(
                        signer,
                        parseInt(telegramId),
                        isLocked,
                        currentData.smartAccounts,
                        currentData.tokens
                    )

                    await axios.post(`${baseURL}approval`, { approval: currentData })
                    setOriginalData(deepClone(currentData))
                }
                setIsUpdatingData(false)
            }
            labelUserAsOnboarded();
        } catch (err) {
            setIsUpdatingData(false)
            throw err
        }

    }, [
        isDataUnchanged,
        metamaskAccount,
        signer,
        currentData,
        fetchWhitelistData,
        deployIfNotYetDeployed
    ])

    const cancelChanges = () => {
        setCurrentData(deepClone(originalData))
    }

    function persistTelegramId(telegramId: number) {
        setTelegramId(telegramId.toString())
        localStorage.setItem("telegramId", telegramId.toString())
    }
    function getTelegramId() {
        return localStorage.getItem("telegramId")
    }

    useEffect(() => {
        fetchWhitelistData();
    }, [fetchWhitelistData, telegramId])
    return (
        <BotSettingsContext.Provider
            value={{
                isLocked,
                toggleLock,
                setCurrentData,
                telegramUsername,
                currentData,
                originalData,
                isLoadingData,
                isUpdatingData,
                isDataUnchanged,
                isUserOnboarded,
                labelUserAsNew,
                labelUserAsOnboarded,
                persistTelegramId,
                saveChanges,
                fetchWhitelistData,
                getTelegramId,
                cancelChanges
            }}>
            {children}
        </BotSettingsContext.Provider>
    )
}

export function useBotSettingsContext() {
    return useContext(BotSettingsContext);
}