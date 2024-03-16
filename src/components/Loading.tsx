import { Box, Dialog, Typography } from "@mui/material";
import { keyframes } from '@emotion/react';

import { LoadingIcon } from "./icons";

const rotateKeyFrame = keyframes({
    '0%': {
        transform: 'rotate(0deg)',
    },
    '100%': {
        transform: 'rotate(360deg)',
    },
});

export const rotateInfinity = `${rotateKeyFrame} 2s infinite linear`;

export default function Loading({ msg }: { msg?: string }) {
    return (
        <Dialog
            open={true}
            fullWidth
        >
            <Box width='100%' display='flex' flexDirection='column' alignItems='center' padding={'1rem'}>
                <Typography variant="h5" sx={{
                    marginBottom: '1rem'
                }}>
                    {msg ?? "Please wait..."}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: rotateInfinity
                }}>
                    <LoadingIcon />
                </Box>
            </Box>
        </Dialog>
    )
}