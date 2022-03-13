import { readFileSync } from "fs";
import { sdk } from "./helpers.js";

async function main() {
    // Paste in the address from when you created the bundle collection module
    const bundleModuleAddress = "0x5a876Bbb854dE0706dbD3F62a5AdD8d026E1AEC9";
    
    // When we want to interact with an existing smart contract (contd. below)
    // We use 'sdk.getXxxModule' and pass it the contract address of that module-type
    // So in our case, we're calling 'getBundleModule'
    // And passing it the smart contract address of the bundle collection module that we deployed (contd. below)
    // When we ran the 'node scripts/1-create-bundle-module.js' script
    // From there we can interact with it! ^_^
    const bundleModule = sdk.getBundleModule(bundleModuleAddress);

    console.log('Creating NFT batch...');

    // What we're doing next (see Line: 28), is we're passing our data to the smart contract to create our NFTs
    // For each one, we're passing in metadata which describes the NFT to create
    // And 'supply', which says how many of that NFT we want to have
    // The name, description, and image metadata are standard fields
    
    // The thirdweb SDK allows us to read an image file by using 'readFileSync' (contd. below)
    // And all of the hard work of making that image file work as an NFT, will be done for us

    // Since NFTs can have arbitrary data associated with them (contd. below)
    // The 'properties' field (albeit optional) can host whatever we want it to have
    const created = await bundleModule.createAndMintBatch([
        {
            metadata: {
                name: 'FigiPixi 3',
                description: 'Grey Cap',
                image: readFileSync('./assets/a4.jpg'),
                properties: {
                    rarity: 'not rare',
                    fanciness: 4,
                }
            },
            supply: 60,
        },
        {
            metadata: {
                name: 'FigiPixi 4',
                description: 'Black Aviators',
                image: readFileSync('./assets/a5.jpg'),
                properties: {
                    rarity: 'a bit rare',
                    fanciness: 7,
                }
            },
            supply: 30,
        },
        {
            metadata: {
                name: 'FigiPixi 5',
                description: 'Teal Alien',
                image: readFileSync('./assets/a3.jpg'),
                properties: {
                    rarity: 'super rare',
                    fanciness: 10,
                }
            },
            supply: 10,
            }
        ]);
        
        console.log('NFTs created!')
        console.log(JSON.stringify(created, null, 2));
}

// Reference notes from (Line: 21) in the '1-create-bundle-module.js' file
try {
    await main();
} catch (error) {
    console.error("Error minting the NFTs", error);
    process.exit(1);
}