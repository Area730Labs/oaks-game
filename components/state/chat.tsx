import { MsgType } from "../../interfaces/msg";
import { ChatUsersInfo } from "../ChatContext";
import { StateAction } from "./state";

export interface ChatState {
    history: MsgType[]
    usernames: ChatUsersInfo
    updates: number
}

export function chatStateReducer(state: ChatState, action: StateAction): ChatState {

    const newState: ChatState = {
        history: state.history,
        usernames: state.usernames,
        updates: state.updates + 1
    }

    switch (action.type) {
        case 'msg': {
            newState.history.push(action.data);

            return newState;
        }
        case 'username': {
            newState.usernames[action.data.key] = action.data.value;

            return newState;
        }

        case 'init': {

            newState.history = action.data.history;
            newState.usernames = action.data.users

            return newState;
        }

        default:
            {
                console.log("unknown operation type ")
                throw new Error(`no handler for action type ${action.type}`)
            }
    }
}