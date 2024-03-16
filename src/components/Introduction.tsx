import { Avatar, Box, Dialog, Typography } from "@mui/material";
import CustomizedDialogTitle from "./DialogTitle";
import DialogCloseButton from "./DialogCloseButton";
import { useWalletContext } from "src/contexts/wallet";
import { displayAddress, displayName } from "src/utils/display-address";
import CopyToClipboardButton from "./CopyToClipboard";

export default function Introduction({ onClose }: { onClose: any }) {
    // useEffect(() => {
    //     setTimeout(() => onClose(), 5000);
    // }, [])
    const { smartAccounts, accountNames } = useWalletContext()
    return <Dialog
        open={true}
        onClose={onClose}
        fullWidth
    >
        <CustomizedDialogTitle>
        </CustomizedDialogTitle>
        <DialogCloseButton onClose={onClose} />
        <Box width='100%' display='flex' flexDirection='column' alignItems='center'>
            <Typography
                variant="h3"
            >
                Successfully Connected!
            </Typography>
            <img src="/images/greatswap.png" width='60px' style={{
                marginTop: '1rem'
            }} />
            <Typography
                textAlign='center'
                variant='body2'
                mt='1rem'
            >
                {"Your 5 abstract wallets have been generated which can only be sovereigned by your Metamask accounts. You will trade on them via Great Swap Trading Bot later."}
            </Typography>
            <Box width='100%' px='2rem'>
                {
                    smartAccounts.map((account) => {
                        const name = accountNames.find(a => a.smartAccount === account)?.name
                        return <Box key={account} display='flex' width='100%' alignItems='center' justifyContent='space-between' my='1rem'>
                            <Box display='flex' alignItems='center'>
                                <Avatar
                                    sx={{ height: '1.6rem', width: '1.6rem' }}
                                    src={'/images/greatswap.png'}
                                ></Avatar>
                                <Typography sx={{
                                    marginLeft: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {
                                        name ? displayName(name, 10, 10) :
                                            displayAddress(account, 10, 10).toLowerCase()
                                    }
                                </Typography>
                            </Box>
                            <CopyToClipboardButton hasColor={true} text={account} />
                        </Box>
                    })
                }
            </Box>
            <Typography
                textAlign='center'
                color='primary.main'
                variant='h3'
                my='1rem'
            >
                {`Have fun, earn profit and stay secured!`}
            </Typography>
        </Box>

    </Dialog>
}