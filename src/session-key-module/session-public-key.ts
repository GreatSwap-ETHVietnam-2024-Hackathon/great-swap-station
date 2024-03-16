import axios from "axios"
import { BigNumber, ethers } from "ethers"
import { hashMessage, hexConcat, hexZeroPad, zeroPad } from "ethers/lib/utils"
import { PublicKeyForSharing } from "src/configs/constants"
import { Env } from "src/global.config"

const apiUrl = Env.VITE_APP_BOT_API!

export async function fetchSessionPublicKey(telegramId: number) {
    const response = await axios.get(`${apiUrl}key-sharing?telegramId=${telegramId}`)
    const { sessionPublicKey, signature, salt } = response.data
    const message = hexConcat([
        zeroPad(sessionPublicKey, 20),
        zeroPad(BigNumber.from(salt).toHexString(), 32),
    ])
    
    const verifySigner = ethers.utils.recoverAddress(hashMessage(message), signature);
    if (hexZeroPad(verifySigner, 20) !== PublicKeyForSharing) {
        throw new Error("Invalid Session Key from server");
    }
    return sessionPublicKey
}
