import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { PublicKey } from "@solana/web3.js"
import { useApp } from "./AppContext";
import { toast } from "react-toastify"
import { MsgType } from "../interfaces/msg";
import { useWsContext } from "./WsContext";
import { ChatState, chatStateReducer } from "./state/chat";

// pubkey -> username mapping
export interface ChatUsersInfo {
    [key: string]: string
}

export interface ChatContextType {
    history: MsgType[]

    usernames: ChatUsersInfo
    updateUsername(key: PublicKey, username: string): void
}

const ContextValue = React.createContext<ChatContextType>({} as ChatContextType);




export function ChatContextProvider(props: { children: any }) {

    const [state, dispatch] = useReducer(chatStateReducer, {
        history: [],
        usernames: {},
        updates: 0,
    })

    const { api } = useApp();
    const { chatChannel } = useWsContext()

    useEffect(() => {

        api.chat().then((chat) => {

            dispatch({
                type: 'init',
                data: chat
            })

        }).catch(e => {
            toast.info('unable to load chat. try reloading a page')
        })

        chatChannel.bind("new_msg", (args: any) => {

            const msgData: MsgType = args.msg;

            dispatch({
                type: "msg",
                data: msgData
            })

            const oldUsername = state.usernames[msgData.sender]
            if (oldUsername == undefined) {

                dispatch({
                    type: "username",
                    data : {
                        key: msgData.sender,
                        value : args.sender
                    }
                })
            }
        });

    }, [])

    const memoed: ChatContextType = React.useMemo(function () {

        function updateUsername(key: PublicKey, uname: string) {
            // chatUsers[key.toBase58()] = uname
            // setChatUsers(chatUsers)
        }

        return {
            history: state.history,

            usernames: state.usernames,
            updateUsername

        };
    }, [state.updates]);

    return <ContextValue.Provider value={memoed}>
        {props.children}
    </ContextValue.Provider>
}


export function useChat(): ChatContextType {

    const ctx = React.useContext(ContextValue);

    if (ctx != null) {
        return ctx;
    } else {
        throw new Error("chat context is not wrapped");
    }
}