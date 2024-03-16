import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Network from "./Network";
import Profile from "./Profile";
import { useNavigate } from "react-router";

export default function Topbar() {
    const navigate = useNavigate()
    return (
        <AppBar component='nav' sx={{
            bgcolor: 'black',
            boxShadow: 'none',
        }}>
            <Toolbar
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '65rem',
                }}>
                    <Box display='flex' alignItems='center'>
                        <Box onClick={() => navigate('/')}>
                            <img src="/images/greatswap.png" height='30rem'></img>
                        </Box>
                        <Typography variant="h2" color="primary.main" fontWeight='bold' ml='1rem'>Great Swap</Typography>
                    </Box>


                    <Box display='flex' alignItems='center'
                        justifyContent='space-between'>
                        <Network></Network>
                        <Profile></Profile>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}