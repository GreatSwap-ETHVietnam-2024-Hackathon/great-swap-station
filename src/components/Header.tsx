import { ArrowBackIos } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"


export default function Header({ header }: { header: string }) {
    const navigate = useNavigate()
    return (
        <Box display='flex' alignItems='center' marginBottom='1rem'>

            <ArrowBackIos sx={{ fontSize: "1.2rem", color: "primary.main" }} onClick={() => navigate("/dashboard")} />
            <Typography
                color='text.secondary'
                variant="h5"
                textAlign='center'
                style={{
                    fontWeight: 'bold'
                }}
            >{header}</Typography>
        </Box>
    )
}