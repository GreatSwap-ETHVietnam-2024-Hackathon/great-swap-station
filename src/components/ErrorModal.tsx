import { Box, Dialog, Typography } from "@mui/material";
import CustomizedDialogTitle from "./DialogTitle";
import DialogCloseButton from "./DialogCloseButton";
import resolveErrorMessage from "src/utils/resolve-error-message";

export default function ErrorModal({ title, errMessage, onClose }: { title: string, errMessage: string, onClose: any }) {
    return (
        <Dialog
            open={true}
            onClose={onClose}
            fullWidth
        >
            <CustomizedDialogTitle>
                <Typography
                    variant="h3"
                >{title}
                </Typography>
            </CustomizedDialogTitle>
            <DialogCloseButton onClose={onClose} />
            <Box width='100%' display='flex' flexDirection='column' alignItems='center'>
                <img src="/images/fail.png" width='60px' style={{
                    marginTop: '1rem'
                }} />
                <Typography color="error" margin={'1rem'} maxWidth={'400px'} sx={{ overflowY: 'scroll' }} textAlign={'center'}>{resolveErrorMessage(errMessage)}</Typography>
            </Box>

        </Dialog>
    )
}