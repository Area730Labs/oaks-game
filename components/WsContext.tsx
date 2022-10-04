import React, { useEffect, useMemo } from "react";
import Pusher, { Channel } from "pusher-js"
import GlobalConfig from "../config";

export interface WsContextType {
    mainChannel: Channel,
    chatChannel: Channel
}

const ContextValue = React.createContext<WsContextType>({} as WsContextType);

export function WsContextProvider(props: { children: any }) {

    // init connection
    const pusher = useMemo(() => {
        return new Pusher(GlobalConfig.pusherAppKey, {
            cluster: 'eu',
        });
    }, []);

    const [mainChannel, chatChannel] = useMemo(() => {

        const channelObj = pusher.subscribe(GlobalConfig.pusherMainChannel)
        const chatChannel = pusher.subscribe(GlobalConfig.chatChannel)

        return [channelObj, chatChannel];
    }, [pusher]);

    const memoed: WsContextType = React.useMemo(function () {

        return {
            mainChannel,
            chatChannel
        };
        
    }, [mainChannel, chatChannel]);

    return <ContextValue.Provider value={memoed}>
        {props.children}
    </ContextValue.Provider>
}


export function useChat(): WsContextType {

    const ctx = React.useContext(ContextValue);

    if (ctx != null) {
        return ctx;
    } else {
        throw new Error("ws context is not wrapped");
    }
}