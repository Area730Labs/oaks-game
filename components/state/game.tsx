import { BreadcrumbLink } from "@chakra-ui/react";
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

    switch (action.type) {

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