import { useWeb3 } from "@3rdweb/hooks";

import { ThirdwebSDK } from "@3rdweb/sdk";

import type { PackMetadataWithBalance, BundleMetadata } from "@3rdweb/sdk";

import { useEffect, useState } from "react";

import { bundleAddress, packAddress } from "../lib/contractAddresses";

import NFT from "../components/nft";

// Our <OpenButton> component takes 2 props: the 'packModule' and our 'afterOpen' function
// We already have the 'packModule' since we're using it in our lounge page to fetch owned packs (see Line: 39)
// So we just need to decide on an 'afterOpen' function
import OpenButton from "../components/open-button";

// The thirdweb pack module has a 'getOwned' function (contd. below)
// And this returns us the packs owned by a given wallet address, and the no. owned

export function getStaticProps() {
  return {
    props: {
      title: "Lounge",
    },
  };
}

export default function Lounge() {
  // We obtain the connected wallet address from 'useWeb3'
  // We need the 'provider' from 'useWeb3' (contd. below)
  // Until now, we've not tried sending a transaction from our app
  // We've used the SDK to read state (such as owned NFTs).
  // We've also signed messages to verify our wallet address.
  // But neither of these were transactions, because they did not modify the state of our smart contracts
  // Our server on the other hand, has done that when it rewards packs. We have not though, from the frontend
  // The SDK by default, will not have a signer set up for the connected wallet (contd. below)
  // And so it won't be able to send transactions for a connected account. We need to set that up
  const { address, provider } = useWeb3();

  // We store a state for loading
  const [loading, setLoading] = useState(false);

  // And we store a state for pack NFTs -- which is of that type 'PackMetadataWithBalance'
  const [packNfts, setPackNfts] = useState<PackMetadataWithBalance[]>([]);

  // We need some state to hold out bundle NFTs, just like we did for our pack ones
  const [bundleNfts, setBundleNfts] = useState<BundleMetadata[]>([])

  const sdk = new ThirdwebSDK("https://winter-icy-sun.matic-testnet.quiknode.pro/f36aa318f8f806e4e15a58ab4a1b6cb9f9e9d9b9/");
  // const sdk = new ThirdwebSDK("https://rpc-mumbai.matic.today");
  // const packModule = sdk.getPackModule(packAddress);

  {/* ## DEFUNCT ##
  async function getNftsWithLoading() {
    setLoading(true)
    try {
      const fetchedPackNfts = await packModule.getOwned(address)
      console.log(fetchedPackNfts)
      setPackNfts(fetchedPackNfts)
    } finally {
      setLoading(false)
    }
  }
*/}

  // Now we can use 'getNfts' as the 'afterOpen' function, and it will quietly update the page for us
  // The benefit: is that it will look more like a real-time update, rather than the data being re-fetched
  async function getNfts() {
    // const fetchedPackNfts = await packModule.getOwned(address); {{ DEFUNCT }}
    const [fetchedPackNfts, fetchedBundleNfts] = await Promise.all([
      packModule.getOwned(address),
      bundleModule.getOwned(address),
    ])
    console.log({ fetchedPackNfts, fetchedBundleNfts });
    setPackNfts(fetchedPackNfts);
    setBundleNfts(fetchedBundleNfts);
  }

  async function getNftsWithLoading() {
    setLoading(true);
    try {
      await getNfts()
    } finally {
      setLoading(false);
    }
  }

  // 'return'  must be the last
  // A way to organize a react component like below:
  // 1. useState/variables (const & let)
  // 2. useEffect
  // 3. functions
  // Then put 'return' to render the component.
  
  // In terms of no. 2 and 3, the order of them depends on a dev or a team's coding rule.
  // Some developers prefers to put all 'useEffects' together. 

  useEffect(() => {
    if (address) {
      getNftsWithLoading()
    }
  }, [address])

  const signer = provider?.getSigner()
  useEffect(() => {
    if (signer) {
      // We use the 'sdk.setProviderOrSigner' function to persist the signer on the SDK
      // Now it will be used for calls made against modules
      sdk.setProviderOrSigner(signer)
    }
  }, [signer])


  // const sdk = new ThirdwebSDK("https://winter-icy-sun.matic-testnet.quiknode.pro/f36aa318f8f806e4e15a58ab4a1b6cb9f9e9d9b9/");
  // const sdk = new ThirdwebSDK("https://rpc-mumbai.matic.today");
  const packModule = sdk.getPackModule(packAddress);

  const bundleModule = sdk.getBundleModule(bundleAddress);

  // If there's no wallet address, we can't do anything because we can't check for their NFTs
  // So we inform them that they need to connect, in order to access the page
  if (!address) {
    return <p className="text-red-800">Please connect your wallet to access the lounge</p>
  }

  if (loading) {
    // We add a 'return' when we're loading
    // The 'getNftsWithLoading' function above (see Line: 37) sets it to TRUE when querying for packs
    // And then sets it to FALSE once it is done
    // So we have a little spinner while we're querying the data
    return (
      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/200/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        <span className="sr-only">Loading</span>
      </svg>
    )
  }

  // Update our access check, to check if we have any NFTs from either contract
  // That way, if we have no packs but we do have opened NFTs (contd. below)
  // Then we'll display the 'Winners Lounge'  and its super-secret content
  if (packNfts.length === 0 && bundleNfts.length === 0) {
    // The original message we had is returned when the user does not have any NFTs
    // They don't get to access the lounge
    return (
      <p>You need to own some NFTs to access the lounge!</p>
    )
  }

  // Finally, we have the render for users who DO have NFTs
  // We utilise our NFT component (ref Line: 11) + the 'nft.tsx' file (contd. below)
  // In order to display the NFT pack the user owns
  // We also show their balance (see Line: 105)
  // Note that 'ownedByAddress' is a 'BigNumber' -- so we use 'toString' to display it
  return (
    <div className="flex flex-col gap-8">
      {packNfts.length > 0 && (
        <div>
          <h2 className="text-4xl font-bold">Your Packs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 mt-4 gap-2">
            <div className="border border-blue-500 rounded-lg p-4">
              <NFT metadata={packNfts[0].metadata} />
              <p className="text-gray-800">Balance: {packNfts[0].ownedByAddress.toString()}</p>
              <OpenButton packModule={packModule} afterOpen={getNfts} />
            </div>
          </div>
        </div>
      )}

      {bundleNfts.length > 0 && (
        <div>
          <h2 className="text-4xl font-bold">Your Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 mt-4 gap-2">
            {bundleNfts.map((nft) => (
              <div className="border border-blue-500 rounded-lg p-4" key={nft.metadata.id}>
                <NFT metadata={nft.metadata} />
                <p className="text-gray-800">Balance: {nft.ownedByAddress.toString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*

      ## Thirdweb makes it super easy to token-gate a page
      # All we have to do is query 'getOwned(address)' on our smart contract
      # This will give us access to all the NFTs from our smart contract, that's owned by that wallet address
      # And we can use whatever logic we like, to decide what to render (or not render) based on that

      */}

      <div>
        {/* <h2 className="text-4xl font-bold">Some secret content!</h2>
        <p>This content is only available to users with NFTs! 🤫</p>
        {/*<p>You can put anything you like here!</p>*/}
      </div>
    </div>
  )

  // return <p>You need to own some NFTs to access the lounge!</p>;
}
