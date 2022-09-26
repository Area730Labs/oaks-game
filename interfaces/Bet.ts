import { NftInfo } from "./NftInfo";
import { UserObject } from "./UserObject";

export interface BetObject {
    user : UserObject
    createdAt: number,
    solSum: number,
    nfts: NftInfo[],
}
