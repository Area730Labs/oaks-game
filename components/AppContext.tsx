import React from "react";
import { Bet } from "../interfaces/Bet";

export interface AppContextType {
    bets : Bet[],
}

const fakeBets = [{

}];

const ContextValue = React.createContext<AppContextType>({} as AppContextType);

export function AppContextProvider(props: { children: any }) {


    const memoed: AppContextType = React.useMemo(function () {

        return {
            bets: fakeBets
        };
    }, []);

    return <ContextValue.Provider value={memoed}>
        {props.children}
    </ContextValue.Provider>
}


export function useApp(): AppContextType {

    const ctx = React.useContext(ContextValue);

    if (ctx != null) {
        return ctx;
    } else {
        throw new Error("app context is not wrapped");
    }
}