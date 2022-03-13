import { readFileSync } from "fs";
import { sdk } from "./helpers.js";

async function main() {
    const bundleModuleAddress = '0x5a876Bbb854dE0706dbD3F62a5AdD8d026E1AEC9';
    const bundleModule = sdk.getBundleModule(bundleModuleAddress);

    const packModuleAddress = '0x93337D59C1019130E60F4e02C9535d32bB2DDea0';
    const packModule = sdk.getPackModule(packModuleAddress);

    // Here, we're going to use the contents of the bundle as the 'source of truth' for creating our pack
    console.log('Getting all NFTs from bundle...');
    const nftsInBundle = await bundleModule.getAll();

    console.log('NFTs in bundle:');
    console.log(nftsInBundle);

    console.log('Creating a pack containing the NFTs from bundle...');
    const created = await packModule.create({
        // We need to pass our 'assetContract'
        // Which is just the address of a smart contract containing NFTs that we can put in the pack
        // In this instance, this is our 'bundle collection module'
        assetContract: bundleModuleAddress,
        // The metadata can also include a description and properties
        metadata: {
            name: 'FigiPixes Pack',
            image: readFileSync('./assets/pack.jpg'),
        },
        // 'assets' describe the tokens from our contract, and the amount of them we want to include in the pack
        // Since we just want whatever is in our bundle (contd. below)
        // We can map over 'nftsInBundle' to build up the data structure that we need here
        // When we define the assets that we want in our pack (contd.below)
        // We need to give them the token ID (metadata.id) and the amount (nft.supply)
        assets: nftsInBundle.map(nft => ({
            tokenId: nft.metadata.id,
            amount: nft.supply,
        })),
    });

    console.log('Pack created!')
    console.log(created);
}

try {
    await main();
} catch (error) {
    console.error("Error minting the NFTs", error);
    process.exit(1);
}