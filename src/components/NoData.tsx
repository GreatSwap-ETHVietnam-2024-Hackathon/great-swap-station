import { Box, Typography } from "@mui/material";

export default function NoData({text}: {text: string}) {
    return (
        <Box
            display='flex'
            alignItems='center'
            flexDirection='column'
            justifyContent='center'
            height='100%'
        >
            <img src="/images/Nodata.png" alt="no-data"
                style={{
                    width: '70px',
                    marginBottom: '1rem',
                    opacity: 0.5
                }} />
            <Typography variant="h5" color='text.secondary'>{text}</Typography>

        </Box>
    )
}