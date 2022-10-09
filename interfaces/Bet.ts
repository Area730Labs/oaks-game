import Nft from "./nft";
import { UserObject } from "./UserObject";

export interface BetObject {
    uid : string ,
    user : UserObject
    created_at: number,
    value: number,
    nfts: Nft[],
    state: number
    confirmed? : boolean,
    sol_value: number,
}
