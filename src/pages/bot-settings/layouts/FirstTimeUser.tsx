import { Avatar, Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Loading from "src/components/Loading";
import ResponsiveBox from "src/components/ResponsiveBox";
import VerticalLinearStepper from "src/components/Stepper";
import { useBotSettingsContext } from "src/contexts/bot-settings";
import ParticipatingWallets from "../participating-wallets";
import TradablePairs from "../tradable-pairs";
import { ExpandMore } from "@mui/icons-material";
import { useWalletContext } from "src/contexts/wallet";
import { displayAddress, displayName } from "src/utils/display-address";
import CopyToClipboardButton from "src/components/CopyToClipboard";
import QRCode from "react-qr-code";
import ContractAddress from "src/configs/contracts";
import { Multicall__factory } from "src/typechain-types";
import { formatEther } from "ethers/lib/utils";
import { grey } from "@mui/material/colors";

const MulticallInterface = Multicall__factory.createInterface();

export function FirstTimeUserLayout({
    askedSave,
    setShowConfirmSave,
    handleSave,
    setWarningMessage,
}: {
    askedSave: boolean;
    setShowConfirmSave: React.Dispatch<React.SetStateAction<boolean>>;
    handleSave: () => Promise<void>;
    setWarningMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const { isLoadingData, isUpdatingData } = useBotSettingsContext();
    const { currentData, labelUserAsOnboarded } = useBotSettingsContext();
    const isSmallScreen = useMediaQuery("(max-width:40rem)");
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const { accountNames, provider } = useWalletContext();
    const { isDataUnchanged } = useBotSettingsContext();
    const [smartAccountIndex, setSmartAccountIndex] = useState<number>(0);
    const [balances, setBalances] = useState<string[]>(accountNames.map((_a) => "0.0"));
    const [loadingInfo, setLoadingInfo] = useState<boolean>(false);

    const fetchTokenBalance = useCallback(async () => {
        if (!provider) return;
        setLoadingInfo(true);

        const calls = accountNames.map((accountName) => {
            return {
                target: ContractAddress.Multicall,
                allowFailure: true,
                callData: MulticallInterface.encodeFunctionData("getEthBalance", [accountName.smartAccount]),
            };
        });

        const callResults = await Multicall__factory.connect(ContractAddress.Multicall, provider).callStatic.aggregate3(calls);

        const balances = callResults.map((res) => {
            if (res.returnData.length > 2) {
                formatEther(MulticallInterface.decodeFunctionResult("getEthBalance", res.returnData)[0]);
            }
            return "0";
        });

        setBalances(balances);
        setLoadingInfo(false);
    }, [accountNames, provider]);

    useEffect(() => {
        fetchTokenBalance();
    }, [fetchTokenBalance]);

    return (
        <>
            <Typography
                sx={{
                    my: "1rem",
                }}
            >
                Instead of giving private keys, you authorize <strong>Great Swap Trading Bot</strong> to trade on behalf of your abstract
                wallets. You can restrict which pairs the bot can trade and which abstract wallets will join. Additionally, you can revoke
                bot permissions by setting Lock Great Swap Trading Bot: <strong>True</strong>
            </Typography>

            <Typography>
                Supported DEXes: <strong>Pancake, Lynex</strong>
            </Typography>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: isSmallScreen ? "column" : "row",
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                    }}
                >
                    <Button
                        onClick={labelUserAsOnboarded}
                        variant="outlined"
                        sx={{
                            mt: "3rem",
                            mb: "2rem",
                            px: "1em",
                            width: "fit-content",
                        }}
                    >
                        Cancel Instruction
                    </Button>
                    <VerticalLinearStepper
                        labels={[
                            "Choose abstract wallets to trade with the Bot",
                            "Choose which pairs the bot can trade on",
                            "(Optional) Deposit to your abstract wallets",
                        ]}
                        activeIndex={step - 1}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        mt: isSmallScreen ? "2rem" : 0,
                    }}
                >
                    <ResponsiveBox>
                        {step === 1 && (
                            <>
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        mb: "1rem",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        disabled={currentData.smartAccounts.length === 0}
                                        onClick={() => setStep(2)}
                                        sx={{
                                            width: "48%",
                                        }}
                                    >
                                        Next step
                                    </Button>
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: "1rem",
                                    }}
                                >
                                    You must choose at least 1 smart wallet in order to move to the next step
                                </Typography>
                                <ParticipatingWallets />
                            </>
                        )}
                        {step === 2 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: "1rem",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => setStep(1)}
                                        sx={{
                                            width: "48%",
                                        }}
                                    >
                                        Previous step
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={currentData.tokens.length === 0}
                                        onClick={() => setStep(3)}
                                        sx={{
                                            width: "48%",
                                        }}
                                    >
                                        Next step
                                    </Button>
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: "1rem",
                                    }}
                                >
                                    You must choose at least 1 pair in order to move to the next step
                                </Typography>
                                <TradablePairs />
                            </Box>
                        )}
                        {step === 3 && (
                            <>
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: "2rem",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => setStep(2)}
                                        sx={{
                                            width: "48%",
                                        }}
                                    >
                                        Previous step
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "48%",
                                        }}
                                        variant="contained"
                                        disabled={isDataUnchanged}
                                        onClick={async () => {
                                            if (askedSave) setShowConfirmSave(true);
                                            let warningMessage = undefined;
                                            if (currentData.smartAccounts.length == 0) {
                                                warningMessage = "There are no participating wallets. Continue anyway?";
                                            } else if (currentData.tokens.length == 0) {
                                                warningMessage = "There are no pairs to trade. Continue anyway?";
                                            }
                                            setWarningMessage(warningMessage);
                                            if (askedSave == false && warningMessage == undefined) await handleSave();
                                        }}
                                    >
                                        <Typography variant="h6">Save Configuration</Typography>
                                    </Button>
                                </Box>
                                <Typography variant="h6">
                                    Press "Save Configuration" and sign transactions to commit your bot settings onto the blockchain
                                </Typography>
                                <FormControl
                                    fullWidth
                                    sx={{
                                        mt: "2rem",
                                    }}
                                    variant="outlined"
                                >
                                    <InputLabel id="demo-simple-select-label">Smart Account</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={smartAccountIndex}
                                        label="Smart Account"
                                        //@ts-ignore
                                        onChange={(e) => setSmartAccountIndex(parseFloat(e.target.value))}
                                        IconComponent={ExpandMore}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: "black",
                                                },
                                            },
                                        }}
                                    >
                                        {accountNames.map((accountName, index) => {
                                            return (
                                                <MenuItem key={index} value={index}>
                                                    <Box display="flex" alignItems="center" width={"100%"} bgcolor={grey}>
                                                        <Avatar src={"/images/greatswap.png"}></Avatar>
                                                        <Typography
                                                            sx={{
                                                                mx: "1rem",
                                                                mr: "auto",
                                                            }}
                                                        >
                                                            {isSmallScreen
                                                                ? accountName.name
                                                                    ? displayName(accountName.name, 10, 5)
                                                                    : displayAddress(accountName.smartAccount, 2, 5)
                                                                : accountName.name
                                                                ? displayName(accountName.name, 5, 2)
                                                                : displayAddress(accountName.smartAccount, 10, 10)}
                                                        </Typography>
                                                        {loadingInfo ? (
                                                            <Typography variant="h6" mr="1rem">
                                                                Loading balance...
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                variant="h6"
                                                                mr="1rem"
                                                                sx={{
                                                                    color: "text.primary",
                                                                }}
                                                            >
                                                                {Number(balances[index]).toPrecision(6) + " ETH"}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>

                                <Box display="flex" flexDirection="column" alignItems="center" my="1rem">
                                    <Box display={"flex"} mb={"1rem"} mt="1rem">
                                        <Typography variant="h5" color="text.secondary">
                                            Account address:
                                        </Typography>
                                        <Box display="flex" alignItems="center" ml="0.5rem">
                                            <Typography marginRight="1rem" fontWeight={500}>
                                                {displayAddress(accountNames[smartAccountIndex].smartAccount, 7, 10)}
                                            </Typography>
                                            <CopyToClipboardButton hasColor={true} text={accountNames[smartAccountIndex].smartAccount} />
                                        </Box>
                                    </Box>
                                    <Typography variant="h5" color="text.secondary">
                                        {"Deposit QR code (for Metamask)"}
                                    </Typography>
                                    <QRCode
                                        style={{
                                            height: "auto",
                                            maxWidth: "15rem",
                                            width: "100%",
                                            marginTop: "2rem",
                                            border: "solid 0.2rem white",
                                        }}
                                        value={accountNames[smartAccountIndex].smartAccount}
                                        viewBox={`0 0 256 256`}
                                    />
                                </Box>
                            </>
                        )}
                    </ResponsiveBox>
                </Box>
            </Box>
            {isLoadingData && <Loading msg="Loading Great Swap Trading Bot configuration data..." />}
            {isUpdatingData && <Loading msg="Updating Great Swap Trading Bot configuration data..." />}
        </>
    );
}
