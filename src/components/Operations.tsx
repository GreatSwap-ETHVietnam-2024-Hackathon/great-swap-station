import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ATIKIcon, TelegramIcon, WalletsIcon } from "./icons";
import { useCallback, useMemo } from "react";
import { useBotSettingsContext } from "src/contexts/bot-settings";

interface OperationProps {
    icon: JSX.Element,
    name: string,
    path: string,
    disabled?: boolean
}

export default function Operations() {

    const { getTelegramId } = useBotSettingsContext()

    const telegramId = getTelegramId()
    const navigate = useNavigate()
    const location = useLocation();

    const currentPath = useMemo(() => {
        return location.pathname?.split('/')[1] ?? 'bot-settings'
    }, [location])
    const onGoToBotSettings = useCallback(() => {
        if (telegramId) {
            navigate(`/bot-settings/${telegramId}`)
        } else {
            navigate(`/bot-settings`)
        }
    }, [telegramId])

    const handleChangeTab = useCallback((newTab: string) => {
        if (newTab === 'bot-settings') {
            onGoToBotSettings();
        } else navigate(`/${newTab}`)
    }, [onGoToBotSettings])
    const listOperations = [
        {
            icon: <TelegramIcon />,
            name: "Bot Settings",
            path: 'bot-settings',

        },
        {
            icon: <WalletsIcon />,
            name: "Wallets",
            path: 'wallets',

        }
    ]
    return <Box
        width={'100%'}
        display='flex'
        alignItems='center'
        justifyContent='center'
        marginTop='2rem'
    >
        {listOperations.map(op => op.path).includes(currentPath) &&
            <Tabs
                variant="scrollable"
                value={currentPath}
                scrollButtons={"auto"}
                onChange={(_e, newValue) => handleChangeTab(newValue)}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
                sx={{
                    ".MuiTabs-flexContainer": {
                        position: "relative",
                        minWidth: "fit-content",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            borderRadius: "2px",
                            backgroundColor: "rgba(128, 128, 128, 0.2)",
                            zIndex: -1,
                        },
                        ".MuiTab-root": {
                            // flexGrow: 1,
                            overflow: "visible",
                            "&[disabled]": {
                                color: "text.primary",
                                opacity: 0.3,
                                cursor: "not-allowed",
                                pointerEvents: "auto",
                            },
                            textTransform: "none",
                            fontWeight: 600,
                        },
                    },
                    ".MuiTabs-indicator": {
                        height: 4,
                        borderRadius: "10px",
                        bgcolor: "primary.main",
                        zIndex: 5,
                    },
                    '.MuiTouchRipple-child': {
                        bgcolor: '#00c8ff'
                    }
                }}
            >
                {listOperations.map((e: OperationProps) => (
                    <Tab
                        disabled={e.disabled}
                        key={e.name}
                        value={e.path}
                        sx={{ minWidth: "280px" }}
                        label={
                            <Box
                                key={e.name}
                                display='flex'
                                flexDirection='column'
                                alignItems='center'
                                flex='1'
                                padding='1rem'
                                maxWidth='250px'
                                sx={{
                                    cursor: 'pointer',
                                }}>
                                {e.icon}
                                <Typography sx={{
                                    mt: '0.4em'
                                }} color="primary.main">{e.name}</Typography>
                            </Box>

                        }
                    />
                ))}
            </Tabs>}
    </Box>
}

