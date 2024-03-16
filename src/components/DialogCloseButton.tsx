import { Close } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function DialogCloseButton({ onClose }: any) {
    return <Box
        aria-label="close"
        onClick={onClose}
        sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
        }}
    >
        <Close />
    </Box>
}