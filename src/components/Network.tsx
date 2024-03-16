import { Avatar, Box, Typography } from "@mui/material";

export default function Network() {
    return (
        <Box sx={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            marginRight: '1rem',
            position: 'relative',
            borderRadius: '24px',
            padding: '0.5rem',
        }}>
            <Avatar src={'/images/networks/linea.png'}
                sx={{ height: '2rem', width: '2rem', mr: '1rem' }}></Avatar>
            <Typography color='secondary.main'
                variant="h6"
                style={{ fontWeight: '600' }}>
                Linea Folknet
            </Typography>
        </Box>
    )
}