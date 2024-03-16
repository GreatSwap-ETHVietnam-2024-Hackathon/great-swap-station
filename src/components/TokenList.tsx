import { Close } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Dialog, Divider, InputAdornment, List, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { TokenInfo, useTokensContext } from "src/contexts/tokens";

export function TokenList({ onClose, onChooseToken }: any) {

    const { findTokenInfo, addSuggestedTokenInfo, manuallyAddedTokens, suggestedTokens } = useTokensContext();
    const [foundToken, setFoundToken] = useState<TokenInfo | undefined | null>();
    const [findingAddress, setFindingAddress] = useState<string>('')
    const onFindingToken = useCallback(async (e: React.BaseSyntheticEvent) => {
        const findingToken = e.target.value;
        setFindingAddress(findingToken)
        setFoundToken(null)
        const info = await findTokenInfo(findingToken)
        setFoundToken(info)
    }, [findTokenInfo])

    const onAddingTokenInfo = useCallback(() => {
        if (!findingAddress || !foundToken) return;
        addSuggestedTokenInfo(findingAddress, foundToken);
        onChooseToken(findingAddress);
        onClose()
    }, [addSuggestedTokenInfo, findingAddress, foundToken])

    return (
        <Dialog open onClose={onClose} fullWidth>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '1rem', paddingRight: '1rem', marginTop: '1rem' }}>
                <Typography variant="h3" fontWeight='600'>
                    Token list
                </Typography>
                <Close onClick={onClose} />
            </Box>


            <Box padding="1rem" width="100%">

                <Box width='100%'>

                    <TextField
                        label="Token Address"
                        variant="outlined"
                        fullWidth
                        value={findingAddress}
                        onChange={onFindingToken}
                        placeholder="Enter token address"
                        error={findingAddress.length > 0 && foundToken === undefined}
                        helperText={findingAddress.length > 0 && foundToken === undefined && 'No token is found for this address'}
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
                        <Box display='flex' alignItems='center' onClick={onAddingTokenInfo}
                            my='0.5rem'
                            p='0.5rem'
                            sx={{
                                ':hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                        >
                            {foundToken.imageUrl.length > 0 ? <Avatar
                                src={foundToken.imageUrl} sx={{ height: '1.6rem', width: '1.6rem' }}>

                            </Avatar> :
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
                                fontWeight: '600'
                            }}>
                                {`${foundToken.symbol}`}
                            </Typography>
                        </Box>
                    }
                </Box>

                <Divider sx={{ my: '1rem' }} />

                {


                    <List sx={{
                        overflowY: 'scroll',
                        maxHeight: '20vh'
                    }}>

                        <Box
                            key={'ETH'}
                            display='flex'
                            alignItems='center'
                            p='0.5rem'
                            onClick={() => {
                                onChooseToken('ETH')
                                onClose()
                            }}
                            sx={{
                                ':hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    height: '1.6rem', width: '1.6rem',
                                }}
                                src={'/images/tokens/eth.png'}
                            ></Avatar>
                            <Typography sx={{
                                marginLeft: '0.8rem',
                                fontWeight: '600'
                            }}>
                                {`ETH`}
                            </Typography>

                        </Box>

                        <Box
                            key={'WETH'}
                            display='flex'
                            alignItems='center'
                            p='0.5rem'
                            onClick={() => {
                                onChooseToken('WETH')
                                onClose()
                            }}
                            sx={{
                                ':hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    height: '1.6rem', width: '1.6rem',
                                }}
                                src={'/images/tokens/weth.png'}
                            ></Avatar>
                            <Typography sx={{
                                marginLeft: '0.8rem',
                                fontWeight: '600'
                            }}>
                                {`WETH`}
                            </Typography>

                        </Box>
                        {
                            [...Object.keys(manuallyAddedTokens), ...Object.keys(suggestedTokens)].map((token) => {
                                const info = manuallyAddedTokens[token] ?? suggestedTokens[token]
                                return info && <Box
                                    key={token}
                                    display='flex'
                                    alignItems='center'
                                    p='0.5rem'
                                    onClick={() => {
                                        onChooseToken(token)
                                        onClose()
                                    }}
                                    sx={{
                                        ':hover': {
                                            bgcolor: 'primary.dark'
                                        }
                                    }}
                                >
                                    {info.imageUrl.length > 0 ? <Avatar src={info.imageUrl} sx={{ height: '1.6rem', width: '1.6rem' }}></Avatar> :
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
                                        fontWeight: '600'
                                    }}>
                                        {`${info.symbol}`}
                                    </Typography>

                                </Box>
                            })
                        }
                    </List>
                }
            </Box>
        </Dialog >
    )
}