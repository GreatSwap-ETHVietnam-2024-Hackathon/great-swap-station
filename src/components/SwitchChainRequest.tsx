import { Box, Button, Dialog, Typography } from "@mui/material";
import CustomizedDialogTitle from "./DialogTitle";
import { useWalletContext } from "src/contexts/wallet";

export default function SwitchChainRequest() {
    const { isWrongChain, switchChain } = useWalletContext();

    return (isWrongChain) ? (
        <Dialog
            open={true}
            fullWidth
        >
            <CustomizedDialogTitle>
            </CustomizedDialogTitle>
            <Box width='100%' display='flex' flexDirection='column' alignItems='center'>
                <Typography
                    variant="h3"
                >
                    Current chain is not supported
                </Typography>
                <img src="/images/greatswap.png" width='60px' style={{
                    marginTop: '1rem'
                }} />
                <Typography
                    textAlign='center'
                    variant='body2'
                    mt='1rem'
                >
                    Please switch your Metamask account to Linea
                </Typography>
                <Button variant="contained"
                    onClick={switchChain}
                    sx={{
                        marginTop: '1rem',
                    }}>
                    <Typography variant="h6">
                        Switch to Linea
                    </Typography>
                </Button>
            </Box>

        </Dialog>
    ) : <></>
}