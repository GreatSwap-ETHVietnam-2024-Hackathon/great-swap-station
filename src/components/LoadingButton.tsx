import { ArrowBackIos } from "@mui/icons-material"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import { ReactNode, useState } from "react"
import { useNavigate } from "react-router-dom"


export default function LoadingButton({ props, onClick, children }: { props: any, onClick: () => Promise<void>, children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { disabled, variant } = props
    return (
        <Button variant={variant} disabled={disabled} onClick={async () => {
            setLoading(true);
            await onClick();
            setLoading(false)
        }}>
            {loading ? <CircularProgress sx={{ color: variant == "outlined" ? "primary.main" : "#FFF" }} size='1.5rem'></CircularProgress> : children}
        </Button>
    )
}