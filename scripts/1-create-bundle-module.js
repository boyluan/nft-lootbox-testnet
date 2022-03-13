import { getApp } from "./helpers.js";

// This is our 'main' function
// Here, we get our app (project) from thirdweb, and then deploy the bundle collection module
// We give it a name, and also need to set 'sellerFeeBasisPoints'
// thirdweb lets you set a royalty, so that you get a cut when your NFTs etc. are traded on
// 'sellerFeeBasisPoints: 100' = 1%
async function main() {
    const app = await getApp();

     console.log('Deploying bundle collection module...');

     const bundleModule = await app.deployBundleModule({
         name: 'Lootbox Bundle',
         sellerFeeBasisPoints: 2000, // 20%
     });

     console.log(`Deployed bundle collection module with address ${bundleModule.address}`);
}

// We will repeat this at the bottom of each script
// It's just boilerplate so that our 'main' function (Line: 3) can be async, and we can handle any errors
// Boilerplate: text that can be reused in new contexts or applications, without significant changes to the original
// So for each script, we just need to focus on that 'main' function
try {
    await main();
} catch (error) {
    console.error("Error creating the bundle collection", error);
    process.exit(1);
}