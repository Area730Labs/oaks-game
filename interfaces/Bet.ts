import { NftInfo } from "./NftInfo";

export interface Bet {
    username: string,
    createdAt: number,
    solSum: number,
    nfts: NftInfo[],
}
