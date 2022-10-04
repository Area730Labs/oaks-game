import React, { useEffect, useState } from "react";
import { BetObject } from "../interfaces/Bet";
import { PublicKey } from "@solana/web3.js"
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react"
import Api, { handleApiError } from "../api";
import { AuthArgs } from "../interfaces/auth";
import { v4 as uuidv4 } from 'uuid';
import bs58 from "bs58";
import { UserType } from "../interfaces/user";
import { toast } from 'react-toastify';
import { useWsContext } from "./WsContext";

export interface AppContextType {
    bets: BetObject[]
    betsTotalSol: number
    authToken: string | null
    currentWallet: PublicKey | null
    api: Api
    user: UserType | null
    setUser(u: UserType): void
    currentModal: string
    setCurrentModal(name: string): void
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
}, {
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

const AUTH_TOKEN_LOCAL_STORAGE_KEY_PREFIX = "auth_token_";
const ContextValue = React.createContext<AppContextType>({} as AppContextType);

function getAuthToken(wallet: PublicKey | null): string | null {

    if (wallet != null) {
        return localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY_PREFIX + wallet?.toBase58())
    } else {
        return null;
    }
}

function lsSetAuthToken(wallet: PublicKey, value: string) {
    return localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY_PREFIX + wallet.toBase58(), value)
}

async function generateAuthArgs(wctx: WalletContextState): Promise<AuthArgs> {

    const timestamp = Math.floor(Date.now() / 1000)

    const uid = uuidv4()

    const args: AuthArgs = {
        pubkey: (wctx.publicKey as PublicKey).toBase58(),
        uid: uid,
        timestamp: timestamp,
        signature: ""
    }

    const msgToSign = `${args.uid};${args.timestamp}`

    if (wctx.signMessage == null) {
        throw new Error("message sign is not supported");
    }

    const message = new TextEncoder().encode(msgToSign);
    const signature = await wctx.signMessage(message);

    let sig = bs58.encode(signature);

    args.signature = sig

    return args;
}

export function AppContextProvider(props: { children: any }) {

    const { publicKey, connected } = useWallet();
    const wctx = useWallet();

    const [authToken, setAuthToken] = useState<string | null>(getAuthToken(publicKey));
    const [user, setUser] = useState<UserType | null>(null);
    const [apiHandler, setApiHandler] = useState(new Api(publicKey, authToken))

    const [currentModal, setCurrentModal] = useState<string>("");

    const [forceAuthCounter, setForceAuthCounter] = useState<number>(0);

    const {mainChannel} = useWsContext();

    useEffect(() => {
        if (connected) {
            setApiHandler(new Api(publicKey, getAuthToken(publicKey)))
        } else {
            setApiHandler(new Api(null, null));
        }
    }, [authToken])


    useEffect(() => {
        if (user != null && !user.initialized) {
            setCurrentModal("useredit");
        }
    }, [user]);

    useEffect(() => {
        if (apiHandler.hasAuth()) {
            apiHandler.me().then((userinfo) => {
                setUser(userinfo);
            }).catch(e => {
                handleApiError(e, (code: number, msg: string) => {
                    // token expired or not found
                    if (code == 41 || code == 42 || code == 43) {
                        lsSetAuthToken(publicKey as PublicKey, "");
                        setForceAuthCounter(forceAuthCounter+1)
                    } else {
                        toast.warn(`auth problem: ${msg}`)
                    }
                })
            })
        } else {
            setUser(null);
        }
    }, [apiHandler,forceAuthCounter,setForceAuthCounter])

    useEffect(() => {

        if (connected) {

            const atoken = getAuthToken(publicKey);
            if (atoken != null && atoken != "") {
                setAuthToken(atoken);
            } else {
                generateAuthArgs(wctx).then((args) => {

                    const localApi = new Api(publicKey, null);

                    localApi.auth(args).then((authResponse) => {
                        // update token in lcoal storage
                        lsSetAuthToken(publicKey as PublicKey, authResponse.session);
                        setAuthToken(authResponse.session);
                    }).catch((e) => {
                        console.error('auth error :', e)
                    });

                }).catch((e) => { // user rejected auth
                    toast.info('auth rejected')
                })
            }
        } else {
            setAuthToken("")
        }

    }, [connected, publicKey, apiHandler,forceAuthCounter])

    const memoed: AppContextType = React.useMemo(function () {

        return {
            bets: fakeBets,
            currentWallet: publicKey,
            betsTotalSol: 0.0,
            authorizedWallet: publicKey,
            authToken: authToken,
            api: apiHandler,
            user, setUser,
            currentModal,
            setCurrentModal
        };
    }, [
        publicKey, connected, authToken,
        user, setUser,
        apiHandler,
        currentModal, setCurrentModal
    ]);

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