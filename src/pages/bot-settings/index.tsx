import { useEffect, useState } from "react";
import { Avatar, Box, Button, Checkbox, Dialog, Divider, TextField, Typography, useMediaQuery } from "@mui/material";
import DialogCloseButton from "../../components/DialogCloseButton";
import CustomizedDialogTitle from "../../components/DialogTitle";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useWalletContext } from "../../contexts/wallet";
import { Env } from "src/global.config";
import ErrorModal from "src/components/ErrorModal";
import resolveErrorMessage from "src/utils/resolve-error-message";
import { Edit } from "@mui/icons-material";
import { useBotSettingsContext } from "src/contexts/bot-settings";
import { AdvancedUserLayout } from "./layouts/AdvancedUser";
import { FirstTimeUserLayout } from "./layouts/FirstTimeUser";

export default function BotSettings() {
    const { metamaskAccount } = useWalletContext();
    let [showIdInputForm, setShowIdInputForm] = useState<boolean>(false);
    let [showConfirmSave, setShowConfirmSave] = useState<boolean>(false);
    let [askedSave, setAskedSave] = useState<boolean>(() => {
        const time = localStorage.getItem('EndTimeSave')
        if (time) {
            const endTimeSave = Number(time);
            const currentTimeSave = Date.now();
            if (endTimeSave > currentTimeSave)
                return false;
            else return true;
        }
        else return true;
    })
    const [inputedTelegramId, setInputedTelegramId] = useState<string>();

    const { telegramId } = useParams()
    const {
        telegramUsername,
        getTelegramId,
        cancelChanges,
        saveChanges,
        isLocked,
        persistTelegramId,
        isUserOnboarded
    } = useBotSettingsContext();

    const navigate = useNavigate()

    useEffect(() => {
        if (!telegramId) {

            let telegramIdLocal = getTelegramId();

            if (telegramIdLocal) {
                navigate(`/bot-settings/${telegramIdLocal}`);
            }
            else {
                showIdInputForm = true;
                setShowIdInputForm(showIdInputForm);
            }
        } else {
            persistTelegramId(telegramId)
        }
    }, [telegramId])

    const [isSuccessful, setIsSuccessful] = useState(false)
    const [errMessage, setErrorMessage] = useState<string | undefined>()
    const isSmallScreen = useMediaQuery('(max-width:40rem)');
    const handleSave = async () => {
        try {
            await saveChanges();
            setIsSuccessful(true);
        } catch (err) {
            let message = (err as any).response?.data ?? (err as Error).message
            setErrorMessage(resolveErrorMessage(message))
        }
    }
    const handleRecover = () => {
        cancelChanges();
    }

    const [warningMessage, setWarningMessage] = useState<string | undefined>(undefined)

    return (
        <Box height='100%' display='flex' flexDirection='column'>

            {
                isSuccessful &&
                <Dialog open={true} onClose={() => setIsSuccessful(false)} fullWidth>
                    <CustomizedDialogTitle />
                    <DialogCloseButton onClose={() => setIsSuccessful(false)} />
                    <Box display='flex' flexDirection='column' alignItems='center' width='100%'>
                        <img src="/images/success.png" style={{
                            width: '50px'
                        }} />
                        <Typography
                            variant="h5"
                            color='text.primary'
                            sx={{
                                marginTop: '0.5rem',
                                fontWeight: '600'
                            }}>
                            Update successfully!
                        </Typography>
                        <Typography
                            variant="h6"
                            color='text.primary'
                            textAlign='center'
                            sx={{
                                marginTop: '0.5rem',
                            }}>
                            Now you can move to Great Swap Trading Bot to trade. Remember to deposit ETH and tokens into your abstract wallets for your swaps.
                        </Typography>
                    </Box>
                    <Box display='flex' alignItems='center' margin={'1rem'}>
                        <Button variant="outlined" onClick={() => navigate('/wallets')}>
                            <Typography variant="h6" onClick={() => navigate('/')}>Deposit</Typography>
                        </Button>
                        <Box width='1rem'></Box>
                        <Button variant="contained"
                            href={`https://t.me/${Env.VITE_APP_BOT_NAME}?start=${metamaskAccount}`}
                            target='_blank'
                            onClick={() => setIsSuccessful(false)}>
                            <Typography variant="h6" >Move to Telegram</Typography>
                        </Button>
                    </Box>

                </Dialog>
            }
            {
                errMessage &&
                <ErrorModal title="Bot Settings Error" errMessage={errMessage} onClose={() => setErrorMessage(undefined)} />

            }
            {
                showIdInputForm && (

                    <Dialog open onClose={() => {
                        setShowIdInputForm(false)
                    }}>
                        <CustomizedDialogTitle>
                            Enter your Telegram ID:
                        </CustomizedDialogTitle>
                        <DialogCloseButton onClose={() => setShowIdInputForm(false)} />

                        <Box width='100%' display='flex' flexDirection='column' p={'1rem'}>
                            <TextField
                                label="Telegram ID"
                                variant="outlined"
                                fullWidth
                                value={inputedTelegramId}
                                onChange={(e) => setInputedTelegramId(e.target.value)}
                                required
                            />
                            <Typography sx={{
                                mt: '1rem',
                                mb: '1rem'
                            }}>You can obtain your Telegram ID by chatting with{' '}
                                <Link to={`https://t.me/${Env.VITE_APP_BOT_NAME}?start=${metamaskAccount}`} target="blank" style={{
                                    textDecoration: 'none'
                                }}>
                                    <Typography
                                        color='primary'
                                        sx={{
                                            display: 'inline',
                                            textDecoration: 'underline'
                                        }}>Great Swap Trading Bot</Typography>
                                </Link></Typography>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setShowIdInputForm(false);
                                    if (inputedTelegramId)
                                        navigate(`/bot-settings/${inputedTelegramId}`)
                                }}>
                                Confirm
                            </Button>
                        </Box>


                    </Dialog>
                )
            }
            {
                showConfirmSave && (
                    <Dialog open={true} onClose={() => setShowConfirmSave(false)} fullWidth>
                        <CustomizedDialogTitle />
                        <DialogCloseButton onClose={async () => { setShowConfirmSave(false); }} />

                        <Box my='1rem' width='100%' display='flex' flexDirection='column' alignItems='center'>
                            {
                                !isLocked ?
                                    <Typography variant="h4">Allow User {telegramId} to trade on your abstract wallets?</Typography> :
                                    <Typography variant="h4">Disallow User {telegramId} to trade on your abstract wallets?</Typography>
                            }
                        </Box>

                        <Box display='flex' alignItems='center' px='1rem'>
                            <Checkbox checked={!askedSave} onChange={() => {
                                setAskedSave(askedSave ? false : true)
                                if (!askedSave) localStorage.removeItem('EndTimeSave');
                                else {
                                    const currentTimestamp: number = Date.now();
                                    const newTimestamp: number = currentTimestamp + (2 * 24 * 60 * 60 * 1000);

                                    localStorage.setItem("EndTimeSave", newTimestamp.toString())
                                }

                            }} />
                            <Typography variant="h4" >Don't ask again</Typography>
                        </Box>

                        <Box width='100%' padding='1rem' display='flex' >
                            <Button variant="outlined" sx={{ mr: '1rem' }} onClick={() => setShowConfirmSave(false)}>
                                <Typography variant="h6">No</Typography>
                            </Button>
                            <Button variant="contained" onClick={async () => { setShowConfirmSave(false); await handleSave() }}>
                                <Typography variant="h6">Yes</Typography>
                            </Button>
                        </Box>
                    </Dialog>
                )
            }

            {
                warningMessage &&
                <Dialog open={true} onClose={() => { setShowConfirmSave(false); setWarningMessage(undefined) }} fullWidth>
                    <CustomizedDialogTitle>
                        <Typography
                            variant="h3"
                        >Bot Settings Warning
                        </Typography>
                    </CustomizedDialogTitle>
                    <DialogCloseButton onClose={() => { setShowConfirmSave(false); setWarningMessage(undefined) }} />

                    <Box width='100%' display='flex' flexDirection='column' alignItems='center'>
                        <img src="/images/warning.png" width='60px' style={{
                            marginTop: '1rem'
                        }} />
                        <Typography color="error" margin={'1rem'} maxWidth={'400px'} sx={{ overflowY: 'scroll' }} textAlign={'center'}>{warningMessage}</Typography>
                    </Box>

                    <Box width='100%' padding='1rem' display='flex' >
                        <Button variant="contained" sx={{ mr: '1rem' }} onClick={async () => {
                            setWarningMessage(undefined);
                            if (showConfirmSave == false)
                                await handleSave()
                        }}>
                            <Typography variant="h6">Yes</Typography>
                        </Button>
                        <Button variant="outlined" onClick={() => { setShowConfirmSave(false); setWarningMessage(undefined) }}>
                            <Typography variant="h6">No</Typography>
                        </Button>
                    </Box>
                </Dialog>
            }

            <Box
                sx={{
                    background: 'rgba(248, 222, 194, 0.24)',
                    boxShadow: '0px 0px 4px 0px #170D011A inset',
                    width: '100%',
                    padding: '1rem',
                    display: isSmallScreen ? 'block' : 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    borderRadius: '0.5rem'
                }}
            >
                <Box display='flex' mb={isSmallScreen ? '1rem' : '0'}>
                    <Avatar
                        sx={{ height: '2.7rem', width: '2.7rem', mr: '1rem' }}
                        src={'/images/greatswap.png'}
                    ></Avatar>
                    <Box display='flex' flexDirection='column' justifyContent='space-around'>
                        <Box display='flex' alignItems='center' mb='0.3rem'>
                            <Typography variant="h4">{telegramId ? 'Telegram ID: ' : 'Enter your Telegram ID'} </Typography>
                            {telegramId && <Typography variant="h4" sx={{ fontWeight: '500', mx: '1rem' }}>{telegramId.length > 15 ? `${telegramId.slice(0, 12)}...` : telegramId}</Typography>}
                            <Edit onClick={() => { setShowIdInputForm(true) }} />
                        </Box>
                        {telegramUsername && <Box display='flex' alignItems='center'>
                            <Typography variant="h4" >{'Username: '} </Typography>
                            <Typography variant="h4" sx={{ fontWeight: '500', marginLeft: '1rem' }}>{telegramUsername}</Typography>
                        </Box>}
                    </Box>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Button
                        variant="contained"
                        sx={{
                            p: '1rem'
                        }}
                        href={`https://t.me/${Env.VITE_APP_BOT_NAME}?start=${metamaskAccount}`} target="blank">
                        <Typography variant="h3">Move to Telegram</Typography>
                    </Button>
                </Box>
            </Box>
            {/* {
                !telegramUsername &&
                <Box width='%100' pt='5rem' display='flex' flexDirection='column' alignItems='center'>
                    <NoData text="Telegram user with this ID is not known by Great Swap Trading bot" />
                </Box>
            } */}
            {
                // telegramUsername &&
                <>
                    {
                        isUserOnboarded ?
                            <AdvancedUserLayout
                                askedSave={askedSave}
                                handleSave={handleSave}
                                setShowConfirmSave={setShowConfirmSave}
                                setWarningMessage={setWarningMessage}
                            /> :
                            <FirstTimeUserLayout
                                askedSave={askedSave}
                                handleSave={handleSave}
                                setShowConfirmSave={setShowConfirmSave}
                                setWarningMessage={setWarningMessage}
                            />
                    }
                </>
            }
        </Box >
    )
}

