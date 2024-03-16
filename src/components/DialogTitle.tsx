import { DialogTitle } from "@mui/material"


export default function CustomizedDialogTitle({ children }: any) {
    return (
        <DialogTitle sx={{
            marginLeft: '-0.5rem'
        }}>{children} </DialogTitle>
    )
}