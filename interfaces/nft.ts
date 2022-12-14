import { PublicKey } from "@solana/web3.js";

export default interface Nft {
    address: PublicKey
    name: string
    image: string
    props?: { [key: string]: any }
    collectionName? : string
}
