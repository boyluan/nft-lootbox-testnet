import { PackModule } from "@3rdweb/sdk";
import { useState } from "react";

import toast from "react-hot-toast";

import PrimaryButton from "../components/primary-button";

import NFT from "./nft";

type Props = {
    packModule: PackModule,
    afterOpen: () => Promise<void>,
}

// We use this function to refresh the data on the Lounge page after a pack has been opened
export default function OpenButton({ packModule, afterOpen }: Props) {
    const [opening, setOpening] = useState(false);

    const openPack = async () => {
        setOpening(true);
        try {
            // We're using the thirdweb API to open a copy of the NFT pack
            // If we had multiple types of packs, then we'd need to pass in their respective IDs
            // But as we only have 1, we can hardcode '0'
            const nftMetadata = await packModule.open('0');
            setOpening(false);
            // Here, we're displaying the opened NFT in the toast
            toast.success(
                <NFT metadata={nftMetadata[0]} />,
                {
                    style: {
                        minWidth: '300px',
                    },
                    duration: 5000,
                }
            );
            // We pass in a function that gets called after the open is complete
            // Ref. (Line: 16)
            // As mentioned above (see Line: 15) -- we're going to use this to refresh the data on the Lounge page
            await afterOpen();
        } catch(err) {
            console.error(err)
            setOpening(false);
        }
    }

    return (
        <PrimaryButton onClick={openPack} disabled={opening}>
            {opening ? 'Opening...' : 'Open!'}
        </PrimaryButton>
    )
}