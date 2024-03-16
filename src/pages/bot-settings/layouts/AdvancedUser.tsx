import { Box, Button, Divider, Switch, Typography, useMediaQuery } from "@mui/material";
import ResponsiveBox from "src/components/ResponsiveBox";
import { useBotSettingsContext } from "src/contexts/bot-settings";
import TradablePairs from "../tradable-pairs";
import ParticipatingWallets from "../participating-wallets";
import Loading from "src/components/Loading";

export function AdvancedUserLayout({
    askedSave,
    setShowConfirmSave,
    handleSave,
    setWarningMessage,
}: {
    askedSave: boolean,
    setShowConfirmSave: React.Dispatch<React.SetStateAction<boolean>>,
    handleSave: () => Promise<void>,
    setWarningMessage: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
    const {
        labelUserAsNew,
        cancelChanges,
        isLocked,
        toggleLock,
        isDataUnchanged,
        isLoadingData,
        isUpdatingData,
        currentData
    } = useBotSettingsContext();

    const isSmallScreen = useMediaQuery('(max-width:40rem)');
    const handleRecover = () => {
        cancelChanges();
    }
    return (
        <>
            <Typography
                sx={{
                    my: '1rem'
                }}>
                Instead of giving private keys, you authorize <strong>Great Swap Trading Bot</strong> to trade on behalf of your abstract wallets.
                You can restrict which pairs the bot can trade and which abstract wallets will join.
                Additionally, you can revoke bot permissions by setting Lock Great Swap Trading Bot: <strong>True</strong></Typography>

            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isSmallScreen ? 'initial' : 'center',
                flexDirection: isSmallScreen ? 'column' : 'row'
            }}>
                <Typography>Supported DEXes: <strong>Pancake, Lynex</strong></Typography>
                <Button
                    onClick={labelUserAsNew}
                    variant="outlined"
                    sx={{
                        mt: isSmallScreen ? '2rem' : 'initial',
                        width: 'fit-content',
                        px: '1em'
                    }}>
                    First-time user?
                </Button>
            </Box>
            <Box
                marginTop='1rem'
                flexGrow='1'
                display='flex'
                flexDirection='column'
                width={'100%'}
            >
                <Box sx={isSmallScreen ? {} : {
                    display: 'flex',
                    alignItems: 'stretch',
                }}>
                    <Box flex={1}>
                        <Box height='1rem'></Box>
                        <ResponsiveBox>
                            <ParticipatingWallets />
                        </ResponsiveBox>
                    </Box>
                    <Box sx={{
                        width: '1rem',
                        display: isSmallScreen ? 'none' : 'block'
                    }}></Box>

                    <Box flex={1}>
                        <Box height='1rem'></Box>
                        <ResponsiveBox>
                            <Box sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <TradablePairs />
                            </Box>
                        </ResponsiveBox>
                    </Box>

                    {isSmallScreen && <Divider sx={{ borderWidth: '0.01rem', width: '100%', margin: "1rem 0rem" }}></Divider>}
                </Box>
                <Box mt={'1rem'} width={'100%'} display='flex' flexDirection={isSmallScreen ? 'column' : 'row'} justifyContent='space-between'>
                    <Box
                        display='flex'
                        alignItems='center'
                        mt={'1rem'}
                        mb={'1rem'}>
                        <Typography variant="h6" style={{ color: 'secondary.main' }}>Lock Great Swap Trading Bot</Typography>
                        <Switch checked={isLocked}
                            onChange={toggleLock}
                        ></Switch>
                    </Box>
                    <Box marginTop="auto" display='flex' alignItems='center' marginBottom={'1rem'} width={isSmallScreen ? '100%' : '40%'}>
                        <Button
                            disabled={isDataUnchanged}
                            variant="outlined"
                            onClick={handleRecover}>
                            <Typography variant="h6">Cancel changes</Typography>
                        </Button>
                        <Box width='1rem'></Box>
                        <Button variant="contained"
                            disabled={isDataUnchanged}
                            onClick={async () => {
                                if (askedSave)
                                    setShowConfirmSave(true);
                                let warningMessage = undefined;
                                if (currentData.smartAccounts.length == 0) {
                                    warningMessage = 'There are no participating wallets. Continue anyway?'
                                }
                                else if (currentData.tokens.length == 0) {
                                    warningMessage = 'There are no pairs to trade. Continue anyway?'
                                }
                                setWarningMessage(warningMessage)
                                if (askedSave == false && warningMessage == undefined) await handleSave()
                            }

                            }>
                            <Typography variant="h6">Save</Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>

            {isLoadingData && <Loading msg="Loading Great Swap Trading Bot configuration data..." />}
            {isUpdatingData && <Loading msg="Updating Great Swap Trading Bot configuration data..." />}
        </>
    )
}