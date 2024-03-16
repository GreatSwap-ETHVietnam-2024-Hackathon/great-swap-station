import { Box } from "@mui/material";

export default function ResponsiveBox(props: any) {
    return (
        <Box sx={
            {
                height: '100%',
                padding: '1rem',
                boxShadow: '1px 2px 8px 0px #0000001F',
                borderRadius: '0.5rem',
                background: '#4D4D4D',
                flex: '1'
            }}>
            {props.children}
        </Box>

    )
}