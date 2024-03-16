import { useState } from "react";
import { useWalletContext } from "../contexts/wallet";
import { Avatar, Box, Button, Typography } from "@mui/material";
import Loading from "src/components/Loading";
import ErrorModal from "src/components/ErrorModal";


export default function Login() {
    const { setShowIntro, connecting, handleConnectMetamask } = useWalletContext();
    const [connectionError, setConnectionError] = useState<string | undefined>();
    const handleLogin = async () => {
        try {
            await handleConnectMetamask()
            setShowIntro(true)
        } catch (err) {
            setConnectionError((err as Error).message)
        }
    }
    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            padding='2rem'
            height='100vh'
        >
            <img src="/images/greatswap.png" height='50rem'></img>
            <Typography variant="h1" color={'primary.main'} fontWeight={'bold'}>Great Swap</Typography>
            <Box sx={{
                marginBottom: '2rem'
            }}>
                <Typography variant="h2"
                    sx={{ fontWeight: 600, display: 'inline' }}>
                    On-chain Trading Bot
                </Typography>

                <Typography variant="h2"
                    sx={{ fontWeight: 600, display: 'inline', color: 'primary.main', mr: '0.5rem' }}>
                    _
                </Typography>

                <Typography variant="h2"
                    sx={{ fontWeight: 600, display: 'inline' }}>
                    with Account Abstraction
                </Typography>

                <Typography variant="h2"
                    sx={{ fontWeight: 600, display: 'inline', color: 'primary.main' }}>
                    _
                </Typography>

            </Box>
            <Typography>
                Welcome to Great Swap! Your trading bot available on Telegram and soon on TwitterX and Webapp.
            </Typography>
            <Typography sx={{ marginBottom: '1rem' }}>
                Trade faster, smarter with absolute control over your wallets
            </Typography>
            <Button variant="contained" onClick={handleLogin} sx={{
                maxWidth: '400px'
            }}>
                <Box display='flex' alignItems='center' justifyContent='center'>
                    <Avatar src="/images/metamask.png" style={{ height: '1.7rem', width: '1.7rem', marginRight: '0.8rem' }}></Avatar>
                    <Typography variant="h5">Sign in with Metamask</Typography>
                </Box>
            </Button>
            {connecting && <Loading msg="Connecting to Metamask..." />}
            {connectionError && <ErrorModal title="Metamask Connection Error" errMessage={connectionError} onClose={() => setConnectionError(undefined)} />}
        </Box>
    )
}