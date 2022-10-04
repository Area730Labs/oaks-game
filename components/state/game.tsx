import { BetObject } from "../../interfaces/Bet";
import { GameType } from "../../interfaces/game";
import { PlayerType } from "../../interfaces/player";
import { StateAction } from "./state";

export interface GameState {
    game : GameType
    players : PlayerType[]
    bets: BetObject[]
    updates : number
}


export function reduce(state: GameState, action: StateAction): GameState {

    const newState: GameState = {
        bets: state.bets,
        game: state.game,
        players : state.players,
        updates: state.updates + 1
    }

    switch (action.type) {
        // case 'msg': {
        //     newState.history.push(action.data);

        //     return newState;
        // }
       

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