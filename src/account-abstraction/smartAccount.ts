import { Signer, ethers, providers } from "ethers";
import ContractAddress from "src/configs/contracts";
import { Multicall__factory } from "src/typechain-types";
import { ECDSAModule__factory } from "src/typechain-types/factories/ECDSAModule__factory";
import { SmartAccountFactory__factory } from "src/typechain-types/factories/SmartAccountFactory__factory";

const ecdsaModuleInterface = ECDSAModule__factory.createInterface()
const factoryInterface = SmartAccountFactory__factory.createInterface()

function ecdsaOwnershipSetupData(eoaSigner: string) {
    return ecdsaModuleInterface.encodeFunctionData(
        "initForSmartAccount",
        [eoaSigner]
    );
}

export async function isAccountDeployed(provider: ethers.providers.Web3Provider, smartAccount: string) {
    const contractCode = await provider.getCode(smartAccount);
    const isDeployed = contractCode.length > 2;
    return isDeployed
}

export async function deployAccounts(eoaSigner: Signer, indexes: number[]){
    const tx = await SmartAccountFactory__factory.connect(ContractAddress.SmartAccountFactory, eoaSigner).deployMultipleCounterFactualAccounts(
        ContractAddress.SwapSessionKeyManager,
        ContractAddress.ECDSAModule,
        ecdsaOwnershipSetupData(await eoaSigner.getAddress()),
        indexes
    )

    await tx.wait();
}
export async function getSmartAccountsForEOASigner(provider: providers.Web3Provider, eoaSigner: string, accountsNum: number): Promise<string[]> {
    const indexes = [...Array(accountsNum).keys()]

    const calls = indexes.map(index => ({
        target: ContractAddress.SmartAccountFactory,
        allowFailure: true,
        callData: factoryInterface.encodeFunctionData("getAddressForCounterFactualAccount", [
            ContractAddress.SwapSessionKeyManager,
            ContractAddress.ECDSAModule,
            ecdsaOwnershipSetupData(eoaSigner),
            index
        ])
    }))

    const multicall = Multicall__factory.connect(ContractAddress.Multicall, provider);
    const results = await multicall.callStatic.aggregate3(calls)

    return results.map(res => factoryInterface.decodeFunctionResult("getAddressForCounterFactualAccount", res.returnData)[0].toLowerCase())
}

