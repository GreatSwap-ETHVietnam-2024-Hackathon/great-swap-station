import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import { Avatar, Box, ClickAwayListener, Typography, useMediaQuery } from "@mui/material";
import { useWalletContext } from "../contexts/wallet";
import { displayAddress } from "../utils/display-address";
import CopyToClipboardButton from "./CopyToClipboard";
import { Logout, SwapHorizRounded } from "@mui/icons-material";
import { WalletIcon } from "./icons";
import Loading from "./Loading";
import ErrorModal from "./ErrorModal";
import Introduction from "./Introduction";
import SwitchChainRequest from "./SwitchChainRequest";

import { keyframes } from '@emotion/react';

const fadeKeyFrame = keyframes({
    '0%': {
        opacity: 0
    },
    '100%': {
        opacity: 1
    },
});
const fadeAnimation = `${fadeKeyFrame} 0.3s linear`;

export default function Profile() {
    const isSmallScreen = useMediaQuery('(max-width:40rem)');
    const [showProfile, setShowProfile] = useState(false);
    const [networkErrOn, setNetworkErr] = useState(false);
    const { provider, metamaskAccount, handleConnectMetamask, connecting, showIntro, setShowIntro, logout, deploying, isWrongChain } = useWalletContext()
    const [connectionError, setConnectionError] = useState<string | undefined>();
    useEffect(() => {
        if (!provider) setNetworkErr(true)
    }, [provider])
    const handleChangeAccount = async () => {
        try {
            await handleConnectMetamask()
            setShowIntro(true);
        } catch (err) {
            setConnectionError((err as Error).message)
        }
    }
    const handleLogout = async () => {
        try {
            logout();
        } catch (err) {
            setConnectionError((err as Error).message)
        }
    }
    return (
        <>
            <ClickAwayListener onClickAway={() => setShowProfile(false)}>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', position: 'relative',
                        marginLeft: 'auto',
                        borderRadius: '24px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: 'primary.dark'
                    }} onClick={() => { setShowProfile(showProfile ? false : true) }}>
                        <Avatar
                            sx={{ height: '1.6rem', width: '1.6rem', border: '0.1rem solid', borderColor: 'primary.main', bgcolor: 'white' }}>
                            <WalletIcon />
                        </Avatar>
                        {metamaskAccount && !isSmallScreen && <Typography variant="h6" sx={{
                            mx: '0.5rem', color: 'secondary.main'
                        }}>{displayAddress(metamaskAccount, 5, 5)}</Typography>}
                        <Arrow isPrimaryColor state={showProfile}></Arrow>
                    </Box>
                    {showProfile ? <Box sx={{
                        backgroundColor: 'primary.main',
                        position: 'absolute',
                        borderRadius: '0.5rem',
                        minWidth: '16rem',
                        animation: fadeAnimation,
                        top: "calc(100% + 5px)",
                        right: 0
                    }}>
                        <Box borderBottom={`solid 0.1rem`} borderColor='primary.main' padding='0.5rem' marginBottom='0.5rem'>
                            <Box display='flex' justifyContent='space-between' alignItems='center' marginLeft='0.5rem' marginRight='0.5rem'>
                                <Typography
                                    variant="h6"
                                    style={{
                                        color: 'white'
                                    }}>
                                    {
                                        displayAddress(metamaskAccount!, 10, 5)
                                    }
                                </Typography>

                                <CopyToClipboardButton hasColor={false} text={metamaskAccount!} />
                            </Box>
                        </Box>
                        <Box padding='0.5rem' borderBottom={`solid 0.1rem`} borderColor='primary.main'>
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                marginLeft='0.5rem'
                                marginRight='0.5rem'
                                onClick={handleChangeAccount}
                            >
                                <Typography
                                    variant="h6"
                                    style={{
                                        color: 'white'
                                    }}>
                                    Change Account
                                </Typography>

                                <SwapHorizRounded style={{
                                    color: 'white'
                                }} />
                            </Box>
                        </Box>
                        <Box padding='0.5rem'>
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                marginLeft='0.5rem'
                                marginRight='0.5rem'
                                onClick={handleLogout}
                            >
                                <Typography
                                    variant="h6"
                                    style={{
                                        color: 'white'
                                    }}>
                                    Log out
                                </Typography>

                                <Logout style={{
                                    color: 'white'
                                }} />
                            </Box>
                        </Box>
                    </Box> : null}
                </Box>
            </ClickAwayListener>
            {deploying && <Loading msg="Deploying smart accounts..." />}
            {connecting && <Loading msg="Connecting to Metamask..." />}
            {connectionError && <ErrorModal errMessage={connectionError} title="Metamask Connection Error" onClose={() => setConnectionError(undefined)} />}
            {showIntro && <Introduction onClose={() => setShowIntro(false)} />}
            {isWrongChain && <SwitchChainRequest />}
            {
                networkErrOn && <ErrorModal onClose={() => { setNetworkErr(false) }} errMessage="The network provider used by your Metamask wallet seems not to be working. Consider changing it" title="Network Provider Error" />
            }
        </>
    )
}