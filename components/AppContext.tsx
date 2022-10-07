import React, { useEffect, useReducer, useState } from "react";
import { BetObject } from "../interfaces/Bet";
import { PublicKey, Connection } from "@solana/web3.js"
import { useConnection, useWallet, Wallet, WalletContextState } from "@solana/wallet-adapter-react"
import Api, { handleApiError } from "../api";
import { AuthArgs } from "../interfaces/auth";
import { v4 as uuidv4 } from 'uuid';
import bs58 from "bs58";
import { UserType } from "../interfaces/user";
import { toast } from 'react-toastify';
import { useWsContext } from "./WsContext";
import { GameState, reduce as gameStateReduce } from "./state/game";
import { GameType } from "../interfaces/game";

export interface AppContextType {

    authToken: string | null
    currentWallet: PublicKey | null
    wallet: Wallet,
    api: Api
    user: UserType | null
    setUser(u: UserType): void
    currentModal: string
    setCurrentModal(name: string): void

    game: GameState

    connection: Connection,
    signTransaction: any

}

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

    const wctx = useWallet();
    const { publicKey, connected } = wctx;

    const [authToken, setAuthToken] = useState<string | null>(getAuthToken(publicKey));
    const [user, setUser] = useState<UserType | null>(null);
    const [apiHandler, setApiHandler] = useState(new Api(publicKey, authToken))

    const [currentModal, setCurrentModal] = useState<string>("");

    const [forceAuthCounter, setForceAuthCounter] = useState<number>(0);
    const [gameTotalValue, setGameTotalValue] = useState<number>(0);

    const { connection } = useConnection();
    const { signTransaction } = useWallet();

    const { mainChannel } = useWsContext();

    const [gameState, dispatchGameAction] = useReducer(gameStateReduce, {
        bets: [],
        game: {},
        updates: 0
    } as GameState);

    useEffect(() => {

        apiHandler.game().then(gm => {
            dispatchGameAction({
                type: "init",
                data: gm,
            })
        }).catch(e => {
            console.log(e)
            toast.warn("unable to fetch game info")
        })

        // todo subscribe to all events here

        mainChannel.bind('new_game', (data) => {
            const msgData: GameType = data;

            dispatchGameAction({
                type: "new_game",
                data: msgData
            })
        })

        mainChannel.bind('game_update', (data) => {
            const msgData: GameType = data;

            dispatchGameAction({
                type: "game_update",
                data: msgData
            })
        })

        mainChannel.bind('new_bet', (data) => {
            const msgData: BetObject = data;

            dispatchGameAction({
                type: "new_bet",
                data: msgData
            })
        })

        mainChannel.bind('bet_update', (data) => {
            const msgData: any = data;

            dispatchGameAction({
                type: "bet_update",
                data: msgData
            })
        })

    }, []);

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
                        // setForceAuthCounter(forceAuthCounter + 1)
                    } else {
                        toast.warn(`auth problem: ${msg}`)
                    }
                })
            })
        } else {
            setUser(null);
        }
    }, [apiHandler, forceAuthCounter])

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

    }, [connected, publicKey, forceAuthCounter, wctx])

    useEffect(() => {

        if (publicKey != null) {
            if (gameState.game.winner != "") {

                // todo 
                // check if you took a part in the game

                setTimeout(function () {
                    if (gameState.game.winner == publicKey.toBase58()) {
                        let audio = new Audio('/resources/winner.mp3');
                        audio.play()
                    } else {
                        let audio = new Audio('/resources/looser.mp3');
                        audio.play()
                    }
                }, 5000);

            }
        }


    }, [gameState.game.state, publicKey])

    const memoed: AppContextType = React.useMemo(function () {

        return {
            currentWallet: publicKey,
            betsTotalSol: 0.0,
            authorizedWallet: publicKey,
            authToken: authToken,
            api: apiHandler,
            user, setUser,
            currentModal,
            setCurrentModal,
            wallet: {} as Wallet,
            game: gameState,

            connection, signTransaction
        };
    }, [
        publicKey, connected, authToken,
        user, setUser,
        apiHandler,
        currentModal, setCurrentModal,

        gameState.updates
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