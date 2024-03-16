import { useState } from "react";
import { Snackbar } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { CopyToClipboard } from 'react-copy-to-clipboard';


export default function CopyToClipboardButton({ text, hasColor }: { text: string, hasColor: boolean }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <CopyToClipboard text={text} onCopy={() => setOpen(true)}>
                <ContentCopy sx={{ color: hasColor ? 'primary.main' : 'white' }} />
            </CopyToClipboard>
            <Snackbar
                message="Copied to clipboard"
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
            />
        </>
    );
};