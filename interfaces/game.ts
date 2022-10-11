export interface GameType {
    created_at: number,
    started_at: number,
    hash: string
    uid: string
    max_nfts: number,
    bets_count: number,
    nfts_count: number,
    total_floor_value: number,
    escrow: string,
    winner: string,
    state: number,
    duration_min: number,
    unconfirmed_bets_count: number,
    unconfirmed_nfts_count: number
}