import Nft from "./nft";
import { UserObject } from "./UserObject";

export interface BetObject {
    user : UserObject
    created_at: number,
    value: number,
    nfts: Nft[],
}
