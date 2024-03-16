import React from "react";
import Topbar from "../components/Topbar";
import { LinkItem } from "../App";
import { useWalletContext } from "../contexts/wallet";
import Login from "./Login";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import Operations from "src/components/Operations";
import Footer from "src/components/Footer";
import Background from "src/components/Background";


export interface MainAppProps {
    children: React.ReactNode;
    links: LinkItem[];
}
export default function MainApp(props: MainAppProps) {
    const { metamaskAccount } = useWalletContext();
    const isSmallScreen = useMediaQuery('(max-width:65rem)');

    return (

        <Box display='flex' justifyContent='center' position='relative'>
            <Box sx={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
                <Background />
            </Box>
            {metamaskAccount ? <Box
                minHeight='100vh'
                position='relative'
                padding='0rem 1rem'
                display='flex'
                flexDirection='column'
                paddingBottom='1rem'
                width={isSmallScreen ? '100%' : '65rem'}
            >
                <Toolbar />
                <Topbar />
                <Operations />
                <Box paddingTop='1rem' paddingBottom='2rem' flex='1'>
                    {props.children}
                </Box>
                <Footer />
            </Box > : <Box width='65rem'><Login /></Box>}
        </Box>

    )
}