import { BreadcrumbLink } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { BetObject } from "../../interfaces/Bet";
import { GameType } from "../../interfaces/game";
import { PlayerType } from "../../interfaces/player";
import { StateAction } from "./state";

export interface GameState {
    game: GameType
    players: PlayerType[]
    bets: BetObject[]
    updates: number
}


export function reduce(state: GameState, action: StateAction): GameState {

    const newState: GameState = {
        bets: state.bets,
        game: state.game,
        players: state.players,
        updates: state.updates + 1
    }

    toast.info("got action over ws: " + action.type)

    switch (action.type) {

        case 'new_game': {

            newState.bets = [];
            newState.game = action.data;
            newState.players = []


            break;
        }

        case 'bet_update': {

            const betUid = action.data.bet
            const subAction = action.data.status

            if (subAction != 'rollback') {
                // 
                let newBets = [];
                for (let it of newState.bets) {
                    if (it.uid != betUid) {
                        newBets.push(it);
                    }
                }

                newState.bets = newBets
            } else {

                // confirmed
                // update players

                for (let it of newState.bets) {
                    if (it.uid == betUid) {

                        let found = false;

                        let players: PlayerType[] = [];

                        for (let userIt of newState.players) {
                            if (userIt.pubkey == it.user.wallet) {

                                found = true;

                                userIt.bets += 1
                                userIt.nfts += it.nfts.length
                                userIt.sol_lamports += 0
                                userIt.total_value += it.value

                                players.push(userIt);
                            } else {
                                players.push(userIt);
                            }
                        }

                        if (!found) {
                            players.push({
                                bets: 1,
                                nfts: it.nfts.length,
                                sol_lamports: 0,
                                total_value: it.value,
                                pubkey: it.user.wallet
                            });
                        }

                        newState.players = players

                        break;
                    }
                }
            }

            break;
        }

        case 'new_bet': {


            let newBets = state.bets
            newBets.push(action.data)

            newState.bets = newBets

            break;
        }

        case 'game_update': {

            newState.game = action.data;

            break;
        }

        case 'init': {

            newState.bets = action.data.bets;
            newState.game = action.data.game
            newState.players = action.data.players

            break
        }

        default:
            {
                console.log("unknown operation type ")
                throw new Error(`no handler for action type ${action.type}`)
            }
    }


    return newState
}