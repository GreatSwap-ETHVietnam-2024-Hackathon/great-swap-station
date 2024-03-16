import { Signer } from "ethers";
import { fetchSessionPublicKey } from "./session-public-key";
import { calculateTokenLeaf } from "src/types/approval";
import MerkleTree from "merkletreejs";
import { hexZeroPad, keccak256 } from "ethers/lib/utils";
import ContractAddress, { SupportedRouters } from "src/configs/contracts";
import { ExplorerURL } from "src/configs/constants";
import { SwapSessionKeyManager__factory } from "src/typechain-types";

export async function commitSessionData(
    eoaSigner: Signer,
    telegramId: number,
    locked: boolean,
    participatingSmartAccounts: string[],
    tokens: string[]
) {
    let root: string;
    if (locked || participatingSmartAccounts.length === 0 || tokens.length === 0) {
        root = hexZeroPad("0x00", 32);
    } else {
        const sessionPublicKey: string = await fetchSessionPublicKey(telegramId);
        const routers = Object.values(SupportedRouters);
        const leaves: string[] = [];
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            for (let j = 0; j < participatingSmartAccounts.length; j++) {
                const smartAccount = participatingSmartAccounts[j];
                for (let k = 0; k < routers.length; k++) {
                    leaves.push(calculateTokenLeaf(smartAccount, sessionPublicKey, token, routers[k]));
                }
            }
        }

        for (let j = 0; j < participatingSmartAccounts.length; j++) {
            const smartAccount = participatingSmartAccounts[j];
            leaves.push(calculateTokenLeaf(smartAccount, sessionPublicKey, ContractAddress.WETH, SupportedRouters.PaymasterAddress));
        }

        for (let j = 0; j < participatingSmartAccounts.length; j++) {
            const smartAccount = participatingSmartAccounts[j];
            leaves.push(calculateTokenLeaf(smartAccount, sessionPublicKey, ContractAddress.Cake, SupportedRouters.PaymasterAddress));
        }

        const merkleTree = new MerkleTree(leaves, keccak256, {
            sortPairs: true,
            hashLeaves: false,
            sortLeaves: true,
        });
        root = merkleTree.getHexRoot();
    }

    const tx = await SwapSessionKeyManager__factory.connect(ContractAddress.SwapSessionKeyManager, eoaSigner).setMerkleRoot(root);

    await tx.wait();

    const explorerURL = `${ExplorerURL}/tx/${tx.hash}`;

    return explorerURL;
}
