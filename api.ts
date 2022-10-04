import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import GlobalConfig from "./config";
import { AuthArgs } from "./interfaces/auth";
import { UserType } from "./interfaces/user";

import { toast } from "react-toastify"
import { ChatInfo, MsgType } from "./interfaces/msg";
import { GameType } from "./interfaces/game";
import { GameState } from "./components/state/game";

export type Method = "post" | "get";
export interface SdkItem {

    mint: string
    mint_meta: string

    uid: string
    supply: number
    sold: number
    price: number

    price_mint: string
    created_at: string
    last_sold: string
    inactive: boolean
}

export interface SdkProject {
    authority: string,
    address: string,
}

export function handleApiError(e: any, handler: any) {

    console.log('api error is ', e)

    try {
        const errorStatus = e.response.status;
        if (errorStatus != 400) {
            const errorCode = e.response.data.code;
            const msg = e.response.data.msg

            handler(errorCode, msg);
        } else {
            console.log("got an error ", e)
            toast.warn("something goes wrong, reload page")
        }
    } catch (ee) {
        toast.warn("looks like api server is down. try again later")
    }
}


class Api {


    private host: string = GlobalConfig.apiBaseUrl;
    private authToken: string | null
    private key: PublicKey | null

    constructor(key: PublicKey | null, atoken: string | null) {
        this.authToken = atoken
        this.key = key
    }

    hasAuth(): boolean {
        return this.authToken != null && this.authToken != ""
    }

    async auth(args: AuthArgs): Promise<any> {

        if (this.key == null) {
            throw new Error("trying to auth without wallet connected");
        }

        try {

            let result = await this.sendRequest("post", `user/auth`, args);

            return result;
        } catch (e) {
            throw e;
        }
    }

    async me(): Promise<UserType> {

        try {

            let result = await this.sendRequest(
                "get",
                `user/me`,
                {},
                true
            );

            return result.user as UserType;
        } catch (e) {
            throw e;
        }
    }

    async chat(): Promise<ChatInfo> {

        try {

            let result = await this.sendRequest(
                "get",
                `chat`,
                {},
            );

            return result as ChatInfo;
        } catch (e) {
            throw e;
        }
    }

    async game(): Promise<GameState> {

        try {

            let result = await this.sendRequest(
                "get",
                `game`,
                {},
            );

            return result as GameState;
        } catch (e) {
            throw e;
        }
    }

    async sendMessage(msg: string): Promise<MsgType> {

        try {

            let result = await this.sendRequest(
                "post",
                `chat/send`,
                {
                    msg: msg
                },
                true
            );

            return result.message as MsgType;
        } catch (e) {
            throw e;
        }
    }

    async update(user: UserType): Promise<UserType> {

        try {

            let result = await this.sendRequest(
                "post",
                `user/me`,
                user,
                true
            );

            return result.user as UserType;
        } catch (e) {
            throw e;
        }
    }


    async calc_bet_map(mintsMap: any): Promise<number> {

        let array = [];

        for (var i in mintsMap) {
            array.push(i);
        }

        return this.calc_bet(array)

    }

    async calc_bet(mints: string[]): Promise<number> {

        try {

            let result = await this.sendRequest(
                "post",
                `calc_bet`,
                {
                    mints: mints
                },
                true
            );

            return result.value as number;
        } catch (e) {
            throw e;
        }
    }


    private async sendRequest(rm: Method, method: string, args?: any, auth: boolean = false): Promise<any> {

        const url = this.host + method

        let headersConstructed = {};

        if (auth) {

            if (!this.hasAuth()) {
                throw new Error("no auth token in api");
            }

            headersConstructed = {
                "x-token": this.authToken
            };
        }

        let response_result = await axios.request({
            method: rm,
            url: url,
            data: args,
            headers: headersConstructed
        });

        if (response_result.data != null) {
            return response_result.data;
        } else {
            throw new Error("no response data were found");
        }

    }


}

export interface ClaimOakForm {
    wallet: string
    mint: string,
    tweet_url: string
}

export interface OakRaidRequest {
    tweet_url: string,
    price: number,
    nft_name: string,
    image_url: string,
    tx_sig: string,
    claim_time: number,
    is_over: boolean
}

export default Api;
