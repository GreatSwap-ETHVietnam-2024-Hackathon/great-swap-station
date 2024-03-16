export default function resolveErrorMessage(errorMessage: string) {
    if (errorMessage.includes("AA21 didn't pay prefund")) {
        return "Your smart wallet does not have enough ETH to the transaction fee. Please deposit some"
    }

    if (errorMessage.includes('Replacement UserOperation must have higher maxPriorityFeePerGas')) {
        return errorMessage + ". This error may occur due to transaction duplication"
    }

    if (errorMessage.startsWith("user rejected transaction")) {
        return "You rejected signing"
    }
    if (errorMessage.startsWith("user rejected signing")) {
        return "You rejected signing"
    }
    if (errorMessage.startsWith("missing provider")) {
        return "You don't have the metamask wallet installed in the browser. Please install it"
    }
    return errorMessage
}