import React, { useEffect, useMemo } from "react";
import Pusher, { Channel } from "pusher-js"
import GlobalConfig from "../config";
import { Toast } from "@chakra-ui/react";

export interface WsContextType {
    mainChannel: Channel,
    chatChannel: Channel
}

const ContextValue = React.createContext<WsContextType>({} as WsContextType);

export function WsContextProvider(props: { children: any }) {

    const [mainChannel, chatChannel] = useMemo(() => {

        console.log('ws context redraw')

        const pusher =  new Pusher(GlobalConfig.pusherAppKey, {
            cluster: 'eu',
        });

        const channelObj = pusher.subscribe(GlobalConfig.pusherMainChannel)
        const chatChannel = pusher.subscribe(GlobalConfig.chatChannel)

        return [channelObj, chatChannel];
    }, []);

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


export function useWsContext(): WsContextType {

    const ctx = React.useContext(ContextValue);

    if (ctx != null) {
        return ctx;
    } else {
        throw new Error("ws context is not wrapped");
    }
}