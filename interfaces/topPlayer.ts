export interface TopPlayer {
    winner: string,
    total_value: number,
    games_count: number
}

export interface TopPlayers {
    items: TopPlayer[]
}