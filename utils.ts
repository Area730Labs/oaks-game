
import { Connection, PublicKey } from "@solana/web3.js"
import * as spl from "@solana/spl-token"
import axios from "axios";
import Nft from "./interfaces/nft";
import GlobalConfig from "./config";

export function getTokenAccount(owner: PublicKey, mint: PublicKey): PublicKey {
    return spl.getAssociatedTokenAddressSync(mint, owner)
}

export interface TokenAcc {
    mint : PublicKey
    account : PublicKey
}

export async function getAllNfts(connection: Connection, owner: PublicKey): Promise<TokenAcc[]> {

    const accounts = await connection.getParsedTokenAccountsByOwner(owner, {
        programId: spl.TOKEN_PROGRAM_ID,
    }, 'confirmed')

    let result = [];

    for (var acc of accounts.value) {
        if (acc.account.data.parsed.info.tokenAmount.amount === "1") {
            result.push({
                mint : new PublicKey(acc.account.data.parsed.info.mint),
                account: acc.pubkey
            })
        }
    }

    return result;
}

interface QnNft {
    name: string
    tokenAddress: string
    imageUrl: string
    collectionName: string
}

interface QnNftResponse {
    owner: string,
    assets: QnNft[]
    totalItems: number
    totalPages: number
    pageNumber: number
}

function appendToArray(ar: Nft[], response: QnNftResponse) {


    for (const it of response.assets) {

        const morphed: Nft = {
            address: new PublicKey(it.tokenAddress),
            name: it.name,
            image: it.imageUrl,
            collectionName: it.collectionName
        };

        ar.push(morphed);
    }

}

async function getNftsPage(wallet: PublicKey, page: number): Promise<QnNftResponse> {

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const data = {
        jsonrpc: "2.0",
        id: 1,
        method: "qn_fetchNFTs",
        params: {
            wallet: wallet.toBase58(),
            omitFields: ["provenance", "traits"],
            page: page,
            perPage: 40,
        },
    };

    return axios
        .post(GlobalConfig.rpc, data, config)
        .then(function (response: any) {
            return response.data.result as QnNftResponse;
        })
}


export function roundNumber(value: number, decimals: number): number {
    const mult = Math.pow(10, decimals);
    return Math.ceil(value * mult) / mult
}


export async function getNftsByUser(wallet: PublicKey): Promise<Nft[]> {

    let result: Nft[] = [];

    const firstPageInfo = await getNftsPage(wallet, 1)

    appendToArray(result, firstPageInfo);

    if (firstPageInfo.pageNumber >= 2) {
        for (let i = 2; i <= firstPageInfo.totalPages; i++) {
            const nftsChunk = await getNftsPage(wallet, i);
            appendToArray(result, nftsChunk);
        }

    }
    return result;

}
