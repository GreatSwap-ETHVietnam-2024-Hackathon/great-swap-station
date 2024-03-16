import { useState } from "react";
import { Snackbar } from "@mui/material";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyIcon } from "./icons";


export default function CustomizedCopyToClipboardButton({ text }: { text: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <CopyToClipboard text={text} onCopy={() => setOpen(true)}>
                <CopyIcon />
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