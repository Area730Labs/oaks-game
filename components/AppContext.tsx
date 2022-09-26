import React from "react";
import { BetObject } from "../interfaces/Bet";

export interface AppContextType {
    bets: BetObject[],
    currentWallet: string,
    betsTotalSol: number
}

const fakeBets: BetObject[] = [{
    user: {
        username: "noah",
        image: "https://pbs.twimg.com/profile_images/1552403419176001543/mVVajmCx_400x400.jpg",
        wallet: ""
    },
    createdAt: 0,
    solSum: 30.5,
    nfts: [
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fwww.arweave.net%2FUV8webA4YmATkwIAJTGDCizbnQ7CzoWJugu-wExqVRg%3Fext%3Dpng"
        },
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://metadata.degods.com/g/1954-dead.png"
        },
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fwww.arweave.net%2FGXhG8ElSF3ZkZ2RLaj1Y_3U7FQdFchTfZAsoYDa4RD8%3Fext%3Dpng"
        },
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/XuiGPentkPWP8e9iSXTRZxnCAvnTjKHoJfWNUqQgU_o"
        },
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fwww.arweave.net%2FGXhG8ElSF3ZkZ2RLaj1Y_3U7FQdFchTfZAsoYDa4RD8%3Fext%3Dpng"
        },
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/XuiGPentkPWP8e9iSXTRZxnCAvnTjKHoJfWNUqQgU_o"
        }
    ]
},{
    user: {
        username: "Melon2020",
        image: "https://pbs.twimg.com/profile_images/1556384244598964226/S3cx06I2_400x400.jpg",
        wallet: ""
    },
    createdAt: 0,
    solSum: 15.5,
    nfts: [
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https%3A%2F%2Fwww.arweave.net%2FUV8webA4YmATkwIAJTGDCizbnQ7CzoWJugu-wExqVRg%3Fext%3Dpng"
        },
        {
            image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/XuiGPentkPWP8e9iSXTRZxnCAvnTjKHoJfWNUqQgU_o"
        }
    ]
}];

const ContextValue = React.createContext<AppContextType>({} as AppContextType);

export function AppContextProvider(props: { children: any }) {
    const memoed: AppContextType = React.useMemo(function () {

        return {
            bets: fakeBets,
            currentWallet: "",
            betsTotalSol: 100.0
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