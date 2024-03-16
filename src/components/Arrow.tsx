import { Box } from "@mui/material";

interface ArrowProps {
    state: any,
    isPrimaryColor: boolean,
    onClick: () => void
}

export default function Arrow(props: Partial<ArrowProps>) {
    const {
        state,
        isPrimaryColor = false,
        onClick = () => { }
    } = props;

    return (
        <Box className="material-symbols-outlined"
            sx={{ color: isPrimaryColor ? 'primary.main' : 'text.secondary', fontSize: '1.5rem', cursor: 'pointer', lineHeight: '1' }}
            onClick={onClick}
        >
            {state ? "expand_less" : "expand_more"}
        </Box>

    )
}