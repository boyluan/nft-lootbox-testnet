import { ethers } from "ethers";
import { sdk } from "./helpers.js";

async function main() {
    const packModuleAddress = '0x93337D59C1019130E60F4e02C9535d32bB2DDea0';
    const packModule = sdk.getPackModule(packModuleAddress);

    console.log('Depositing link...')

    // Like most cryptocurrencies, $LINK is subdivided into extremely small units
    // So you can have 0.00001 $LINK for example
    // $LINK uses 18 decimals -- it uses the same sub-division as eth
    // So 10^18 units = 1 $LINK
    // We use the ethers library to help us get the number of units in 2 $LINK, here
    // So this gives us the amount to use for 2 $LINK
    const amount = ethers.utils.parseEther('2');

    // Once we run our script, it should deposit the $LINK to the pack
    await packModule.depositLink(amount);
    console.log('Deposited!')

    const balance = await packModule.getLinkBalance();
    console.log(balance);
}

try {
    await main();
} catch (error) {
    console.error("Error depositing $LINK", error);
    process.exit(1);
}