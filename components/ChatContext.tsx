import React from "react";
import { ChatMessageObject } from "../interfaces/ChatMessage";

export interface ChatContextType {
    history : ChatMessageObject[]
}

const fakeHistory: ChatMessageObject[] = [
    {
        body: "Hendrerit gravida rutrum quisque non",
        username: "Elon2022"
    },
    {
        body: "tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt",
        username: "Rogoz2007"
    },
    {
        body: ":)",
        username: "Lelon2015"
    },
    {
        body: "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
        username: "Roz2007"
    },
    {
        body: "tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt",
        username: "Rogoz2007"
    },
    {
        body: ":)",
        username: "Lelon2015"
    },
    {
        body: "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
        username: "Roz2007"
    },
    {
        body: "tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt",
        username: "Rogoz2007"
    },
    {
        body: "Hello",
        username: "Lelon2015"
    },
    {
        body: "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
        username: "Roz2007"
    },
];

const ContextValue = React.createContext<ChatContextType>({} as ChatContextType);

export function ChatContextProvider(props: { children: any }) {


    const memoed: ChatContextType = React.useMemo(function () {

        return {
            history: fakeHistory
        };
    }, []);

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