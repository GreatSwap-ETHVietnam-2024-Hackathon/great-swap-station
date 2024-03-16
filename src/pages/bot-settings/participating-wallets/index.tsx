import { Typography, List, Avatar, Box, Checkbox } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useBotSettingsContext } from "src/contexts/bot-settings";
import { displayAddress, displayName } from "src/utils/display-address";
import { InfoOutlined } from "@mui/icons-material";
import { CustomizedTooltip } from "src/components/CustomizedTooltip";
import { useWalletContext } from "src/contexts/wallet";
import { Approval } from "src/types/approval";
import { deepClone } from "src/utils/deep-clone";

export default function ParticipatingWallets() {
    const { accountNames } = useWalletContext();
    const { currentData, setCurrentData } = useBotSettingsContext();

    const isWalletChosen = useCallback((wallet: string) => {
        return currentData.smartAccounts.find(w => w.toLowerCase() === wallet.toLowerCase()) !== undefined;
    }, [currentData])

    const allChecked = useMemo(() => {
        return currentData.smartAccounts.length === accountNames.length
    }, [currentData, accountNames])

    const toggleWallet = useCallback((wallet: string) => {
        setCurrentData((pre: Approval) => {
            const participatingWallets = pre.smartAccounts;

            const index = participatingWallets.findIndex(w => w.toLowerCase() === wallet.toLowerCase())
            if (index === -1) {
                participatingWallets.push(wallet)
            }
            else {
                participatingWallets.splice(index, 1);
            }
            return deepClone({
                ...pre,
                smartAccounts: participatingWallets
            })
        })
    }, [setCurrentData, accountNames])

    const toggleAll = useCallback(() => {
        setCurrentData((pre: Approval) => {
            let participatingWallets: string[] = [];
            if (pre.smartAccounts.length === accountNames.length)
                participatingWallets = []
            else participatingWallets = accountNames.map(a => a.smartAccount);
            return deepClone({
                ...pre,
                smartAccounts: participatingWallets
            })
        })
    }, [accountNames])
    return (
        <>
            <Box display='flex' flexDirection='column' height='100%'>
                <Box display='flex' alignItems='center'>
                    <Typography variant="h5" sx={{
                        fontWeight: 500,
                        mb: '0.3rem',
                        mr: '0.3rem'
                    }}>Abstract Wallets
                    </Typography>

                    <CustomizedTooltip
                        placement="right" title="These are abstract wallets derived from your Web3 account, you can allow Great Swap Trading bot to trade on up to 5 of them"
                    >
                        <InfoOutlined sx={{
                            width: '20px',
                            mb: '0.1rem',
                            color: 'text.secondary'
                        }} />
                    </CustomizedTooltip>
                </Box>

                <Box width="100%">
                    <List>
                        {
                            accountNames.map((accountName) => {
                                return <Box key={accountName.smartAccount} display='flex' alignItems='center' justifyContent='space-between'>
                                    <Box display='flex' alignItems='center' my='0.5rem'>
                                        <Avatar
                                            sx={{ height: '1.6rem', width: '1.6rem' }}
                                            src={'/images/greatswap.png'}
                                        ></Avatar>
                                        <Typography sx={{
                                            marginLeft: '0.8rem'
                                        }}>
                                            {(accountName.name ? displayName(accountName.name, 5, 2) : displayAddress(accountName.smartAccount, 10, 10))}
                                        </Typography>
                                    </Box>
                                    <Checkbox disabled={currentData.locked} checked={isWalletChosen(accountName.smartAccount)} onClick={() => toggleWallet(accountName.smartAccount)} />
                                </Box>
                            })
                        }
                    </List>
                    <Box display='flex' alignItems='center' justifyContent='flex-end'>
                        <Typography>
                            Check / Uncheck All
                        </Typography>
                        <Checkbox disabled={currentData.locked} checked={allChecked} onChange={toggleAll} />
                    </Box>
                </Box>
            </Box>

        </>
    )
}
