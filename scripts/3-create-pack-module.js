// The Pack Module will be used to select an NFT at random from the bundle we created
// Ref. the ('2-mint-bundle-nfts.js') file

// The code below, is pretty much the same code for deploying the bundle collection module
// Ref. ('1-create-bundle-module.js') file
// Do also note that the pack (or lootbox) is itself, an NFT
// So it can be traded, and have a royalty, if you like (see Line: 18)

import { getApp } from "./helpers.js";

async function main() {
    const app = await getApp();

    console.log('Deploying pack module...');

    const packModule = await app.deployPackModule({
        name: 'LootboxPack',
        sellerFeeBasisPoints: 2000, // 20%
    });

    console.log(`Deployed pack module with address ${packModule.address}`);
}

try {
    await main()
} catch (error) {
    console.error("Error creating the pack module", error);
    process.exit(1);
}