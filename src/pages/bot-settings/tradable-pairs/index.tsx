import { Typography, List, Avatar, Button, Box } from "@mui/material";
import { useCallback, useState } from "react";
import { useBotSettingsContext } from "src/contexts/bot-settings";
import { TradingPairsCustomizationDialog } from "./customization";
import { useTokensContext } from "src/contexts/tokens";
import { CustomizedTooltip } from "src/components/CustomizedTooltip";
import { InfoOutlined } from "@mui/icons-material";

export default function TradablePairs() {

    const { manuallyAddedTokens, suggestedTokens } = useTokensContext();
    const [showCustomization, setShowCustomization] = useState(false);
    const { currentData, isLocked } = useBotSettingsContext();
    const getTokenInfo = useCallback((token: string) => {
        return manuallyAddedTokens[token] ?? suggestedTokens[token];
    }, [manuallyAddedTokens, suggestedTokens])
    return (
        <>

            <Box display='flex' alignItems='center'>
                <Typography variant="h5" sx={{
                    fontWeight: 500,
                    mb: '0.3rem',
                    mr: '0.3rem'
                }}>Tradable pairs
                </Typography>
                <CustomizedTooltip placement="right" title="Define the scope that Great Swap Trading bot can trade on your abstract wallets">
                    <InfoOutlined sx={{
                        width: '20px',
                        mb: '0.1rem',
                        color: 'text.secondary'
                    }} />
                </CustomizedTooltip>
            </Box>

            {currentData.tokens.length > 0 ?
                <List sx={{ overflowY: 'scroll', maxHeight: '15rem', my: '0.5rem' }}>
                    {
                        currentData.tokens.map((token) => {
                            const info = getTokenInfo(token);
                            return info && <Box key={token} display='flex' alignItems='center' justifyContent='space-between'>
                                <Box display='flex' alignItems='center' my='0.5rem'>
                                    <Avatar
                                        sx={{ height: '1.6rem', width: '1.6rem' }}
                                        src={'/images/tokens/weth.png'}
                                    ></Avatar>
                                    {info.imageUrl.length > 0 ? <Avatar
                                        sx={{ height: '1.6rem', width: '1.6rem' }}
                                        src={info.imageUrl}
                                    ></Avatar> :
                                        <Avatar
                                            sx={{
                                                height: '1.6rem', width: '1.6rem',
                                                bgcolor: 'primary.main',
                                                borderColor: 'black',
                                                borderStyle: 'solid',
                                                borderWidth: '1px',
                                            }}
                                        ><Typography variant="h6" color='white'>{info.symbol[0]}</Typography></Avatar>
                                    }

                                    <Typography sx={{
                                        marginLeft: '0.8rem',
                                    }}>
                                        {`WETH/${info.symbol}`}
                                    </Typography>
                                </Box>

                            </Box>
                        })
                    }
                </List>
                : <Box width='100%' my='1rem' display='flex' justifyContent='center'>
                    <Typography variant="h6" color='text.secondary'>
                        No pair chosen
                    </Typography>
                </Box>}

            <Box flex={1}></Box>

            {
                isLocked ?
                    <CustomizedTooltip title="You must unlock the bot first" placement="top-end">
                        <Box>
                            <Button
                                disabled
                                variant="outlined">
                                <Typography variant="h6" fontWeight={'700'}>{currentData.tokens.length === 0 ? "Add pairs" : "Customize"}</Typography>
                            </Button>
                        </Box>

                    </CustomizedTooltip>
                    :
                    <Button
                        onClick={() => setShowCustomization(true)}
                        variant="outlined">
                        <Typography variant="h6" fontWeight={'700'}>{currentData.tokens.length === 0 ? "Add pairs" : "Customize"}</Typography>
                    </Button>
            }
            {showCustomization && <TradingPairsCustomizationDialog onClose={() => setShowCustomization(false)} />}
        </>
    )
}
