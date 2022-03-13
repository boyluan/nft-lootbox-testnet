// import the thirdweb SDK
import { ThirdwebSDK } from "@3rdweb/sdk";

// 'ethers' is the library we'll use to get a wallet instance that we can pass to the SDK to initialize it
import ethers from "ethers";

// 'dotenv' will read our environment variables from our .env file
// It exposed the contents of the file as environment variables in our script
import dotenv from "dotenv";
dotenv.config();

const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;

if (!walletPrivateKey) {
    console.error("Wallet private key is missing")
    process.exit(1)
}

// Our first export
// Here, we're creating an 'ethers.Wallet' using our private key and a connection to Polygon's testnet
// And we're passing it to the thirdweb SDK
export const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        // Wallet private key (NEVER type share private key in code -- ALWAYS use environment variables)
        process.env.WALLET_PRIVATE_KEY,
        // We use Polygon Mumbai network
        ethers.getDefaultProvider("https://winter-icy-sun.matic-testnet.quiknode.pro/f36aa318f8f806e4e15a58ab4a1b6cb9f9e9d9b9/")
    ),
);

// Your project smart contract address from thirdweb
// The thirdweb SDK uses the term 'app' for projects
const appAddress = "0x75Ac87660FDd5c05Db178842Afa0f68C085cDCC9";

// This is our second export
// This will make a function to get and interact with our project/app available to our other scripts
export async function getApp() {
    const app = await sdk.getAppModule(appAddress);
    return app;
}