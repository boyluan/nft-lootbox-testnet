import type { NFTMetadata } from "@3rdweb/sdk";

type Props = {
    // Note that 'NFTMetadata' is the type of metadata for all NFTs in thirdweb
    // We already saw it for the pack (contd. below)
    // But it'll be the same type when we look at the NFTs in our bundle contract, too
    metadata: NFTMetadata
}

export default function NFT({ metadata }: Props) {
    return (
        <div className="flex flex-col">
            <p className="font-medium text-lg">{metadata.name}</p>
            <img className="w-48 h-36 object-cover" src={metadata.image} alt={metadata.name} />
        </div>
    )
}