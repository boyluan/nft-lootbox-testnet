import { ethers } from "ethers";

import type { ContractInterface } from "ethers";

import { useEffect } from "react";

import { packAddress } from "../lib/contractAddresses";

import packABI from "../utils/PackABI.json";

import { useWeb3 } from "@3rdweb/hooks";

import { toast } from "react-hot-toast";

import Link from "next/link";

export default function usePackEvents() {
    // Below, we're getting the 'address' from 'useWeb3'
    // This address is the connected wallet, not any smart contract
    const { address, provider } = useWeb3();

    // Here, we're using a 'useEffect' so that this logic only runs on the client
    useEffect(() => {
        if (provider) {
            // We then read our 'utils/PackABI.json' as the contract interface
            const abi = packABI as ContractInterface;
            // If you've exported an ABI file before, you may be used to doing 'packABI.abi'
            // But we don't need to do this here, as thirdweb only gives us the abi contents
            const packContract = new ethers.Contract(packAddress, abi, provider);
            // We add an event listener using 'packContract.on' (contd. below)
            // The event we're listening for is called 'TransferSingle'
            // And we can set its arguments from the polygonscan event that we saw previously
            // In our case, we're only concerned about the 'to' address
            packContract.on("TransferSingle", (_operator, _from, to, _id, _value) => {
                // This will detect 'TransferSingle' events sent to ANY address, however
                // So to make sure that we only notify users about theirs (contd. below):
                // We check: 'if (to === address)'
                if (to === address) {
                    // console.log("We received a pack!") {{ DEFUNCT }}
                    toast.success(
                        <div className="flex flex-col gap-2">
                            <p className="text-green-800">
                                {" "}
                                Congratulation! You were awarded a FigiPixes Pack!
                            </p>
                            <p>
                                View and open it in the {" "}
                                <Link href="/lounge">
                                    <a className="underline hover:no-underline">lounge</a>
                                </Link>
                                !
                            </p>
                        </div>,
                        {
                            duration: 5000,
                        }
                    );
                }
            });
        }
        // The dependency array '[!!provider]' means that (contd. below)
        // We're only going to add the event handler when 'provider' goes from unset to set
    }, [!!provider]);

    // ##
    // We'll then add our book to the 'components/layout.tsx' (see Line: 5)
    // Because we know that's inside our '<ThirdwebProvider>'
    // And therefore has access to the connected wallet
}