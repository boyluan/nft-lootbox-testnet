import { sdk } from "./helpers.js";

async function main() {
    const packModuleAddress = '0x93337D59C1019130E60F4e02C9535d32bB2DDea0';
    const packModule = sdk.getPackModule(packModuleAddress);

    console.log('Opening the pack...');
    // We call 'packModule.open('0')' because the 0 here is the ID of the pack we want to open
    // We've only created 1 pack in our module -- but we can have multiple (just like our NFT bundle has many NFTs)
    const opened = await packModule.open('0');
    console.log('Opened the pack!');
    console.log(opened);
}

try {
    await main();
} catch (error) {
    console.error("Error opening the pack", error);
    process.exit(1);
}