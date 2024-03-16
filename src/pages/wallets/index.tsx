import { useWalletContext } from "../../contexts/wallet";
import { Link } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { displayAddress, displayName } from "../../utils/display-address";
import { ExpandMore } from "@mui/icons-material";
import ResponsiveBox from "../../components/ResponsiveBox";
import Loading from "../../components/Loading";
import moment from "moment";
import { TokenList } from "src/components/TokenList";
import { useTokensContext } from "src/contexts/tokens";
import { BigNumber, ethers } from "ethers";
import { AddressZero } from "src/configs/constants";
import { ERC20__factory, Multicall__factory } from "src/typechain-types";
import ContractAddress from "src/configs/contracts";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import ErrorModal from "src/components/ErrorModal";
import CustomizedDialogTitle from "src/components/DialogTitle";
import DialogCloseButton from "src/components/DialogCloseButton";
import CopyToClipboardButton from "src/components/CopyToClipboard";
import QRCode from "react-qr-code";

const MulticallInterface = Multicall__factory.createInterface();
const ERC20Interface = ERC20__factory.createInterface();

export default function Wallets() {
    const { suggestedTokens, manuallyAddedTokens, ETHPrice } = useTokensContext();
    const { transferToken, provider } = useWalletContext();
    const [recipient, setRecipient] = useState<string>("");
    const [smartAccountIndex, setSmartAccountIndex] = useState<number>(0);
    const [tokenToTransfer, setTokenToTransfer] = useState<string>("ETH");
    const [transferAmount, setTransferAmount] = useState<string>("");
    const [validAmountText, setValidAmountText] = useState<"Input must be a positive number" | "Insufficient balance" | undefined>();
    const [validGasFeeText, setValidGasFeeText] = useState<
        "The wallet may not have enough ETH to pay gas for this transaction" | undefined
    >();
    const [validRecipientText, setValidRecipientText] = useState<"Invalid recipient" | undefined>();
    const [transfering, setTransfering] = useState<boolean>(false);
    const [errMessage, setErrorMessage] = useState<string | undefined>();
    const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
    const { accountNames } = useWalletContext();
    const [txHash, setTxHash] = useState<string | undefined>(undefined);
    const [balances, setBalances] = useState<string[]>(accountNames.map((_a) => "0.0"));
    const [loadingInfo, setLoadingInfo] = useState<boolean>(false);
    const [transfered, setTransfered] = useState<boolean>(false);
    const tokenInfo = useMemo(() => {
        if (tokenToTransfer !== "ETH" && tokenToTransfer !== "WETH")
            return suggestedTokens[tokenToTransfer] ?? manuallyAddedTokens[tokenToTransfer];
    }, [tokenToTransfer]);
    const isSmallScreen = useMediaQuery("(max-width:60rem)");
    const checkNewTransferAmount = useCallback(
        (newValue: string) => {
            if (newValue === "") {
                setValidAmountText(undefined);
                return;
            }
            if (isNaN(Number(newValue))) {
                setValidAmountText("Input must be a positive number");
                return;
            }
            const transferAmount = parseFloat(newValue);
            if (transferAmount <= 0) {
                setValidAmountText("Input must be a positive number");
                return;
            }
            if (transferAmount > parseFloat(balances[smartAccountIndex])) {
                setValidAmountText("Insufficient balance");
                return;
            }
            setValidAmountText(undefined);
        },
        [balances, smartAccountIndex]
    );

    useEffect(() => {
        checkNewTransferAmount(transferAmount);
    }, [checkNewTransferAmount, transferAmount]);

    const gasFee = useMemo(() => {
        if (tokenToTransfer === "ETH") return parseEther("0.00011");
        else return parseEther("0.00013");
    }, [tokenToTransfer]);

    const handleChangeAmount = useCallback(
        (e: any) => {
            const newValue = e.target.value;
            setTransferAmount(newValue);
        },
        [checkNewTransferAmount]
    );
    const transferValue = useMemo(() => {
        if (transferAmount === "") return 0;
        if (isNaN(Number(transferAmount))) return 0;
        if (tokenToTransfer === "ETH" || tokenToTransfer === "WETH") return ETHPrice * parseFloat(transferAmount);
        else if (tokenInfo) return parseFloat(tokenInfo.price.toString()) * parseFloat(transferAmount);
    }, [tokenToTransfer, transferAmount, tokenInfo]);

    const setMaxTransferAmount = useCallback(() => {
        if (tokenToTransfer !== "ETH") setTransferAmount(balances[smartAccountIndex]);
        else {
            let maxAmount = parseEther(balances[smartAccountIndex]).sub(gasFee);
            if (maxAmount.lt(BigNumber.from(0))) maxAmount = BigNumber.from(0);
            setTransferAmount(formatEther(maxAmount));
        }
    }, [balances, smartAccountIndex]);

    const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

    const setValidGasFee = useCallback(async () => {
        if (!provider || accountNames.length == 0) return;
        const calls = [
            {
                target: ContractAddress.Multicall,
                allowFailure: true,
                callData: MulticallInterface.encodeFunctionData("getEthBalance", [accountNames[smartAccountIndex].smartAccount]),
            },
        ];
        const callResults = await Multicall__factory.connect(ContractAddress.Multicall, provider).callStatic.aggregate3(calls);
        const balances = callResults.map((res) => {
            if (res.returnData.length > 2) {
                return BigNumber.from(MulticallInterface.decodeFunctionResult("getEthBalance", res.returnData)[0]);
            }
            return BigNumber.from("0x0");
        });
        if (tokenToTransfer !== "ETH" && balances[0].lte(gasFee))
            setValidGasFeeText("The wallet may not have enough ETH to pay gas for this transaction");
        else if (tokenToTransfer === "ETH" && balances[0].lte(parseEther(transferAmount || "0").add(gasFee)))
            setValidGasFeeText("The wallet may not have enough ETH to pay gas for this transaction");
        else setValidGasFeeText(undefined);
    }, [smartAccountIndex, accountNames, provider, tokenToTransfer, transferAmount]);

    useEffect(() => {
        setValidGasFee();
    }, [setValidGasFee]);

    const fetchTokenBalance = useCallback(async () => {
        if (!provider) return;
        setLoadingInfo(true);

        if (transfered == true) await sleep(15000);
        await setValidGasFee();
        let calls: {
            target: string;
            allowFailure: boolean;
            callData: string;
        }[] = [];

        if (tokenToTransfer === "ETH") {
            calls = accountNames.map((accountName) => {
                return {
                    target: ContractAddress.Multicall,
                    allowFailure: true,
                    callData: MulticallInterface.encodeFunctionData("getEthBalance", [accountName.smartAccount]),
                };
            });
        } else {
            let address = tokenToTransfer === "WETH" ? ContractAddress.WETH : tokenToTransfer;
            calls = accountNames.map((accountNames) => {
                return {
                    target: address,
                    allowFailure: true,
                    callData: ERC20Interface.encodeFunctionData("balanceOf", [accountNames.smartAccount]),
                };
            });
        }

        const callResults = await Multicall__factory.connect(ContractAddress.Multicall, provider).callStatic.aggregate3(calls);

        const hexBalances = callResults.map((res) => {
            if (res.returnData.length > 2) {
                return tokenToTransfer === "ETH"
                    ? MulticallInterface.decodeFunctionResult("getEthBalance", res.returnData)[0]
                    : ERC20Interface.decodeFunctionResult("balanceOf", res.returnData)[0];
            }
            return "0x0";
        });

        const balances = hexBalances.map((hex) => {
            if (tokenToTransfer === "ETH" || tokenToTransfer === "WETH") {
                return formatEther(hex);
            }
            if (!tokenInfo) return "0";
            return formatUnits(hex, tokenInfo.decimals);
        });
        setTransfered(false);
        setBalances(balances);
        setTransferAmount("");
        setLoadingInfo(false);
    }, [smartAccountIndex, accountNames, provider, tokenToTransfer, transfered]);

    const onCloseDiaglog = useCallback(async () => {
        // fetchTokenBalance();
        setTxHash(undefined);
    }, [fetchTokenBalance]);

    const tokenSymbol = useMemo(() => {
        if (tokenToTransfer === "ETH" || tokenToTransfer === "WETH") return tokenToTransfer;
        if (!tokenInfo) return "UNKNOWN";
        return tokenInfo.symbol;
    }, [tokenToTransfer, tokenInfo]);
    useEffect(() => {
        fetchTokenBalance();
    }, [fetchTokenBalance]);

    const handleTransfer = useCallback(async () => {
        if (!recipient) return;
        let tokenAddress: string;
        let amount: BigNumber;
        if (tokenToTransfer === "ETH") {
            tokenAddress = AddressZero;
            amount = parseEther(transferAmount);
        } else if (tokenToTransfer === "WETH") {
            tokenAddress = ContractAddress.WETH;
            amount = parseEther(transferAmount);
        } else {
            if (!tokenInfo) return;
            tokenAddress = tokenToTransfer;
            amount = parseUnits(transferAmount, tokenInfo.decimals);
        }
        setTransfering(true);
        try {
            const txHash = await transferToken(smartAccountIndex, tokenAddress, amount, recipient);
            setTxHash(txHash);
        } catch (err) {
            setErrorMessage((err as Error).message);
        }
        setTransfering(false);
        setTransfered(true);
    }, [transferAmount, recipient, tokenInfo, tokenToTransfer, smartAccountIndex]);

    const handleChangeRecipient = (newValue: string) => {
        setRecipient(newValue);
        if (ethers.utils.isAddress(newValue)) {
            setValidRecipientText(undefined);
        } else setValidRecipientText("Invalid recipient");
    };

    return accountNames.length > 0 ? (
        <Box height="100%" display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center">
                <Box width={"100%"} display="flex" flexDirection="column">
                    <ResponsiveBox>
                        <Box
                            width={"100%"}
                            sx={{
                                display: "flex",
                                flexDirection: isSmallScreen ? "column" : "row",
                                justifyContent: "space-around",
                                alignItems: isSmallScreen ? "center" : "flex-start",
                                py: "2rem",
                            }}
                        >
                            <Box flex="1">
                                <Box width="100%">
                                    <FormControl
                                        fullWidth
                                        style={{
                                            marginTop: "1rem",
                                        }}
                                        variant="outlined"
                                    >
                                        <InputLabel id="demo-simple-select-label" sx={{ color: "rgb(49, 203, 158)" }}>
                                            Smart Account
                                        </InputLabel>
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
                                                        <Box display="flex" alignItems="center" width={"100%"}>
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
                                                                    {Number(balances[index]).toPrecision(6) + " " + tokenSymbol}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                    <Box
                                        onClick={() => setShowTokenModal(true)}
                                        width="100%"
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        pl="0.8rem"
                                        pr="0.5rem"
                                        py="0.5rem"
                                        mt="0.8rem"
                                        sx={{
                                            borderRadius: "5px",
                                            borderWidth: "1px",
                                            borderStyle: "solid",
                                            borderColor: "rgba(49,203,158)",
                                            ":hover": {
                                                borderColor: "white",
                                            },
                                        }}
                                    >
                                        {tokenToTransfer === "ETH" ? (
                                            <Box display="flex" alignItems="center">
                                                <Avatar src={"/images/tokens/eth.png"}></Avatar>
                                                <Typography variant="h6" sx={{ ml: "1rem", color: "text.primary" }}>
                                                    ETH
                                                </Typography>
                                            </Box>
                                        ) : tokenToTransfer === "WETH" ? (
                                            <Box display="flex" alignItems="center">
                                                <Avatar src={"/images/tokens/weth.png"}></Avatar>
                                                <Typography variant="h6" sx={{ ml: "1rem", color: "text.primary" }}>
                                                    WETH
                                                </Typography>
                                            </Box>
                                        ) : (
                                            tokenInfo && (
                                                <Box display="flex" alignItems="center">
                                                    {tokenInfo.imageUrl.length > 0 ? (
                                                        <Avatar src={tokenInfo.imageUrl}></Avatar>
                                                    ) : (
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: "primary.main",
                                                                borderColor: "black",
                                                                borderStyle: "solid",
                                                                borderWidth: "1px",
                                                            }}
                                                        >
                                                            <Typography variant="h6">{tokenInfo.symbol[0]}</Typography>
                                                        </Avatar>
                                                    )}
                                                    <Typography variant="h6" sx={{ ml: "1rem", color: "text.primary" }}>
                                                        {tokenInfo.symbol}
                                                    </Typography>
                                                </Box>
                                            )
                                        )}

                                        <Box>
                                            <ExpandMore
                                                sx={{
                                                    mt: "0.5rem",
                                                    cursor: "pointer",
                                                    color: "#000",
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mt: "2rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Transfer Out
                                    </Typography>
                                    <TextField
                                        style={{
                                            marginTop: "1rem",
                                        }}
                                        label="Send to"
                                        variant="outlined"
                                        fullWidth
                                        value={recipient}
                                        error={validRecipientText !== undefined}
                                        helperText={validRecipientText}
                                        onChange={(e) => handleChangeRecipient(e.target.value)}
                                        required
                                    />

                                    <TextField
                                        style={{
                                            marginTop: "1rem",
                                        }}
                                        label="Transfer amount"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Enter the token amount"
                                        value={transferAmount}
                                        onChange={handleChangeAmount}
                                        error={validAmountText !== undefined}
                                        helperText={validAmountText}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Box display="flex" alignItems="center">
                                                        <Typography
                                                            variant="h6"
                                                            onClick={setMaxTransferAmount}
                                                            sx={{
                                                                cursor: "pointer",
                                                                marginLeft: "0.2rem",
                                                                fontWeight: "600",
                                                                color: "primary.main",
                                                                ":hover": { color: "primary.dark" },
                                                            }}
                                                        >
                                                            MAX
                                                        </Typography>
                                                    </Box>
                                                </InputAdornment>
                                            ),
                                        }}
                                        required
                                    />
                                </Box>
                                {validGasFeeText && (
                                    <Typography variant="h6" color="error" mt="0.5rem">
                                        {validGasFeeText}
                                    </Typography>
                                )}
                                <Box flexGrow="1"></Box>
                                <Box width="100%" marginTop="1rem">
                                    <Button
                                        variant="contained"
                                        onClick={handleTransfer}
                                        disabled={
                                            loadingInfo ||
                                            !recipient?.length ||
                                            !transferAmount.length ||
                                            validRecipientText !== undefined ||
                                            validAmountText !== undefined
                                        }
                                    >
                                        <Typography variant="h6">Confirm</Typography>
                                    </Button>
                                </Box>
                            </Box>

                            {isSmallScreen ? (
                                <Divider
                                    sx={{ height: "1rem", width: "100%", display: "flex", alignItems: "center", margin: "1rem 0rem" }}
                                ></Divider>
                            ) : (
                                <Box width="2rem" />
                            )}
                            <Box>
                                <Box display={"flex"} mb={"1rem"} mt="1rem">
                                    <Typography variant="h5" color="primary.main">
                                        Account address:
                                    </Typography>
                                    <Box display="flex" alignItems="center" ml="0.5rem">
                                        <Typography marginRight="1rem">
                                            {displayAddress(accountNames[smartAccountIndex].smartAccount, 7, 10)}
                                        </Typography>
                                        <CopyToClipboardButton hasColor={true} text={accountNames[smartAccountIndex].smartAccount} />
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h5" color="text.primary">
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
                            </Box>
                        </Box>
                    </ResponsiveBox>
                </Box>
            </Box>
            {txHash && (tokenToTransfer === "ETH" || tokenToTransfer === "WETH" || tokenInfo) && (
                <Dialog open={true} onClose={onCloseDiaglog} fullWidth>
                    <CustomizedDialogTitle />
                    <DialogCloseButton onClose={onCloseDiaglog} />
                    <Box
                        width="100%"
                        flexGrow="1"
                        style={{
                            backgroundImage: `url(images/background.png)`,
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h4" fontWeight="600">
                                Successful transaction
                            </Typography>
                            <img
                                src="/images/success.png"
                                width="50px"
                                style={{
                                    marginTop: "1rem",
                                }}
                            />
                            <Typography
                                variant="h3"
                                style={{
                                    marginTop: "1rem",
                                    fontWeight: "600",
                                }}
                            >
                                {transferAmount} {tokenSymbol}
                            </Typography>
                        </Box>

                        <Box width="100%" padding="1rem">
                            <Box width="100%" display="flex" justifyContent="space-between" marginTop="1rem">
                                <Typography variant="h5" color="text.secondary">
                                    To:{" "}
                                </Typography>
                                <Typography variant="h5">{displayAddress(recipient!, 20, 4)}</Typography>
                            </Box>
                            <Box width="100%" display="flex" justifyContent="space-between" marginTop="1rem">
                                <Typography variant="h5" color="text.secondary">
                                    Time:{" "}
                                </Typography>
                                <Typography variant="h5">{moment(Date.now()).format()}</Typography>
                            </Box>
                            <Box width="100%" display="flex" justifyContent="space-between" marginTop="1rem">
                                <Typography variant="h5" color="text.secondary">
                                    Transaction Details:{" "}
                                </Typography>
                                <Link to={txHash} target="blank">
                                    <img src="/images/redirect.png" />
                                </Link>
                            </Box>
                        </Box>
                    </Box>

                    <Box width="100%" padding="1rem">
                        <Button variant="contained" onClick={onCloseDiaglog}>
                            <Typography variant="h6">OK</Typography>
                        </Button>
                    </Box>
                </Dialog>
            )}
            {showTokenModal && <TokenList onClose={() => setShowTokenModal(false)} onChooseToken={setTokenToTransfer} />}
            {errMessage !== undefined && (
                <ErrorModal title="Transfer Out Error" errMessage={errMessage} onClose={() => setErrorMessage(undefined)} />
            )}
            {transfering && <Loading msg="Transfering token..." />}
        </Box>
    ) : (
        <></>
    );
}
