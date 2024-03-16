import { AddBox, AddCircleOutlineOutlined, Close, RemoveCircleOutlineOutlined } from "@mui/icons-material";
import { Avatar, Box, Dialog, List, TextField, Typography, Divider, InputAdornment, useMediaQuery, CircularProgress, Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useBotSettingsContext } from "src/contexts/bot-settings";
import { TokenInfo, useTokensContext } from "src/contexts/tokens";
import { Approval } from "src/types/approval";
import { deepClone } from "src/utils/deep-clone";

export function TradingPairsCustomizationDialog({ onClose }: { onClose: any }) {

    const isSmallScreen = useMediaQuery('(max-width:40rem)');

    const { findTokenInfo, suggestedTokens, manuallyAddedTokens, addTokenInfo, moveFromSuggestions, moveAllFromSuggestions, moveFromManual, moveAllFromManual, ETHPrice } = useTokensContext();
    const { currentData, setCurrentData } = useBotSettingsContext();

    const [foundToken, setFoundToken] = useState<TokenInfo | undefined | null>();
    const [findingAddress, setFindingAddress] = useState<string>('')

    const saveBeforeClose = useCallback(() => {

        setCurrentData((pre: Approval) => {
            pre.tokens = Object.keys(manuallyAddedTokens);
            return deepClone(pre);
        })
        onClose();
    }, [manuallyAddedTokens])

    const onFindingToken = useCallback(async (e: React.BaseSyntheticEvent) => {
        const findingToken = e.target.value;
        setFindingAddress(findingToken)
        setFoundToken(null)
        const info = await findTokenInfo(findingToken)
        setFoundToken(info)
    }, [findTokenInfo])

    const onAddingTokenInfo = useCallback(() => {
        if (!findingAddress || !foundToken) return;
        addTokenInfo(findingAddress, foundToken);
        setFindingAddress('')
        setFoundToken(undefined)
    }, [addTokenInfo, findingAddress, foundToken])

    return (
        <Dialog open onClose={onClose} fullWidth>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '1rem', paddingRight: '1rem', marginTop: '1rem' }}>
                <Typography variant="h3" fontWeight='600'>
                    Customize tradable pairs
                </Typography>
                <Close onClick={onClose} />
            </Box>


            <Box padding="1rem" width="100%">



                <Box width='100%'>
                    <Typography variant="h6">
                        Token to trade with WETH:
                    </Typography>
                    <TextField
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={findingAddress}
                        onChange={onFindingToken}
                        placeholder="Enter token address"
                        error={findingAddress.length > 0 && foundToken === undefined}
                        helperText={findingAddress.length > 0 && foundToken === undefined && 'No pair is found for this token address'}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {foundToken === null && <CircularProgress color='primary' size='1.5rem'></CircularProgress>}
                                </InputAdornment>
                            )
                        }}
                    />

                    {
                        findingAddress && foundToken &&
                        <Box width='100%' display='flex' alignItems='center' justifyContent='space-between' mt='1rem'>
                            <Typography variant="h6">
                                Found pair:
                            </Typography>
                            <Box display='flex' alignItems='center'>
                                <Avatar
                                    sx={{ height: '1.6rem', width: '1.6rem' }}
                                    src={'/images/tokens/weth.png'}
                                ></Avatar>
                                {foundToken.imageUrl.length > 0 ? <Avatar sx={{ height: '1.6rem', width: '1.6rem' }}
                                    src={foundToken.imageUrl}></Avatar> :
                                    <Avatar
                                        sx={{
                                            height: '1.6rem', width: '1.6rem',
                                            bgcolor: 'primary.main',
                                            borderColor: 'black',
                                            borderStyle: 'solid',
                                            borderWidth: '1px',
                                        }}
                                    ><Typography variant="h6" color='white'>{foundToken.symbol[0]}</Typography></Avatar>}
                                <Typography sx={{
                                    mx: '0.8rem',
                                }}>
                                    {`WETH/${foundToken.symbol}`}
                                </Typography>
                                <AddBox color="primary" onClick={onAddingTokenInfo} />
                            </Box>
                        </Box>
                    }
                </Box>

                <Divider sx={{ my: '1rem' }} />

                {Object.keys(manuallyAddedTokens).length > 0 &&
                    <>
                        <Box display='flex' alignItems='center' paddingRight={'0.4rem'} justifyContent='space-between'>
                            <Typography variant="h6" sx={{ my: '0.5rem' }}>Added pairs: </Typography>
                            <Box display='flex' alignItems='center'>
                                <Typography variant="h6" sx={{ mr: '1rem' }}>Remove All </Typography>
                                <RemoveCircleOutlineOutlined color="primary" onClick={() => moveAllFromManual()} />
                            </Box>
                        </Box>

                        <List sx={{
                            overflowY: 'scroll',
                            maxHeight: '20vh',
                        }}>
                            {
                                Object.keys(manuallyAddedTokens).map((token) => {
                                    const info = manuallyAddedTokens[token];
                                    return <Box
                                        key={`${token} added-pairs`}
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        mb={isSmallScreen ? '1rem' : '0'}
                                    >

                                        <Box display='flex' alignItems='center' mb='1rem'>

                                            <Box display='flex' alignItems='center' >
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
                                                    ><Typography variant="h6" color='white'>{info.symbol[0]}</Typography></Avatar>}
                                                <Typography sx={{
                                                    marginLeft: '0.8rem',
                                                }}>
                                                    {`WETH/${info.symbol}`}
                                                </Typography>
                                            </Box>

                                        </Box>
                                        <RemoveCircleOutlineOutlined color="primary" onClick={() => moveFromManual(token)} />
                                    </Box>
                                })
                            }
                        </List>
                    </>
                }
                {Object.keys(suggestedTokens).length > 0 && Object.keys(manuallyAddedTokens).length > 0 && <Divider sx={{ my: '1rem' }} />}
                {Object.keys(suggestedTokens).length > 0 &&
                    <>
                        <Box display='flex' alignItems='center' paddingRight={'0.4rem'} sx={{ my: '0.5rem' }} justifyContent='space-between'>
                            <Typography variant="h6">Suggested pairs: </Typography>
                            <Box display='flex' alignItems='center'>
                                <Typography variant="h6" sx={{ mr: '1rem' }}>Add All </Typography>
                                <AddCircleOutlineOutlined color="primary" onClick={() => moveAllFromSuggestions()} />
                            </Box>

                        </Box>
                        <List sx={{
                            overflowY: 'scroll',
                            maxHeight: '20vh',
                            key: 'suggested-pairs'
                        }}>
                            {
                                Object.keys(suggestedTokens).map((token) => {
                                    const info = suggestedTokens[token];
                                    return <Box
                                        key={`${token} suggested-pairs`}
                                        display='flex'
                                        alignItems='center'
                                        mb='1rem'
                                        justifyContent='space-between'
                                    >

                                        <Box display='flex' alignItems='center'>
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
                                                ><Typography variant="h6" color='white'>{info.symbol[0]}</Typography></Avatar>}
                                            <Typography sx={{
                                                marginLeft: '0.8rem',
                                            }}>
                                                {`WETH/${info.symbol}`}
                                            </Typography>
                                        </Box>
                                        <AddCircleOutlineOutlined color="primary" onClick={() => moveFromSuggestions(token)} />
                                    </Box>
                                })
                            }
                        </List>
                    </>
                }
                <Button
                    sx={{
                        mt: '1rem'
                    }}
                    variant="contained" onClick={saveBeforeClose}>
                    <Typography variant="h6">
                        Confirm
                    </Typography>
                </Button>
            </Box>
        </Dialog >
    );
}