import React, { useCallback, useEffect, useRef, useState } from "react";
import { PublicKey } from "@solana/web3.js"
import { useApp } from "./AppContext";
import { toast } from "react-toastify"
import { MsgType } from "../interfaces/msg";
import { useWsContext } from "./WsContext";

// pubkey -> username mapping
export interface ChatUsersInfo {
    [key: string]: string
}

export interface ChatContextType {
    history: MsgType[]

    usernames: ChatUsersInfo
    updateUsername(key: PublicKey, username: string): void
    setChatUsers(newval: ChatUsersInfo): void
}

const ContextValue = React.createContext<ChatContextType>({} as ChatContextType);

export function ChatContextProvider(props: { children: any }) {

    const [chatUsers, setChatUsers] = useState<ChatUsersInfo>({} as ChatUsersInfo);
    const [history, setHistory] = useState<MsgType[]>([]);

    const hRef = useRef(history);
    hRef.current = history;

    const { api } = useApp();
    const { chatChannel } = useWsContext()

    useEffect(() => {

        chatChannel.bind("new_msg",(args: any) => {

            const msgData : MsgType = args.msg;

            hRef.current.push(msgData)
            setHistory(hRef.current);

            const oldUsername = chatUsers[msgData.sender]
            if (oldUsername == undefined) {
                chatUsers[msgData.sender] = args.sender;
                setChatUsers(chatUsers);
            }

            toast.info('new msg')
        })

    }, [])

    // setup
    useEffect(() => {
        api.chat().then((chat) => {

            setChatUsers(chat.users)
            setHistory(chat.history);

        }).catch(e => {
            toast.info('unable to load chat. try reloading a page')
        })
    }, [api]);

    const memoed: ChatContextType = React.useMemo(function () {

        function updateUsername(key: PublicKey, uname: string) {
            chatUsers[key.toBase58()] = uname
            setChatUsers(chatUsers)
        }

        return {
            history: history,

            usernames: chatUsers,
            setChatUsers, updateUsername

        };
    }, [chatUsers, setChatUsers, history]);

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