import { Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text, Box, Flex, useTabList, SliderProvider, systemProps } from "@chakra-ui/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AppContextType, useApp } from "../AppContext"
import { toast } from 'react-toastify'
import { useStyle } from "../StyleContext"
import { Button } from "../override/Button"
import EmptyRow from "../nft/emptyrow"
import { WalletAdapter } from "@solana/wallet-adapter-base"
import NftsSelector from "../nft/nftselector"
import Nft from "../../interfaces/nft"
import { useWallet } from "@solana/wallet-adapter-react"
import { getAllNfts, getNftsByUser } from "../../utils"
import { RepeatIcon } from "@chakra-ui/icons"
import { BetArgs, handleApiError, mapToArray } from "../../api"
import { PublicKey, Transaction, TransactionBlockhashCtor, SystemProgram, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getAssociatedTokenAddressSync, createTransferInstruction, createAssociatedTokenAccountInstruction } from "@solana/spl-token"
import bs58 from "bs58"
import GlobalConfig from "../../config"
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
  } from "@nfteyez/sol-rayz";


export default function NftSelectorModal() {

    const maxSelection = 5;

    const { styles } = useStyle();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { connected } = useWallet();
    const { currentModal, api, setCurrentModal, user, setUser, currentWallet, connection } = useApp();
    const initialRef = React.useRef(null)
    const [nfts, setNfts] = useState<Nft[]>([]);

    const [loading, setLoading] = useState(false);

    const getNfts = async() => {

        const publicAddress = await resolveToWalletAddress({
            text: 'HUCVagK86Rtq12uw9b3JqBAv2uRhokh7rhwsMbFjWRr7',
            connection: new Connection('https://081a13wcbCLI4kHm4dKE0cNFY9RkIu80KYZZy3jMlXSbvzg9Un9HzhhhRWG0J.xyz2.hyperplane.dev')
        });

        console.log('>>> start nft fetch')
        const nftArray = await getParsedNftAccountsByOwner({
            publicAddress,
        });

        console.log('got mints: ' + nftArray.length);
    };

    const forceReloadNfts = useCallback(() => {
        if (connected) {
            if (isOpen) {

                const walletToFetch = currentWallet;

                setLoading(true);
                getNftsByUser(walletToFetch).then((nftsInfo) => {

                    // if (nftsInfo.partial) {
                    //     toast.info("too much nfts in wallet, images skipped")
                    // }

                    return getAllNfts(connection, walletToFetch).then(function (tokenaccs) {

                        // console.log('all nfts oldapi : ', JSON.stringify(tokenaccs))

                        let mints = [];
                        let mintToTokenacc = {};
                        for (let n of tokenaccs) {
                            mints.push(n.mint);
                            mintToTokenacc[n.mint.toBase58()] = n.account
                        }

                        api.whitelist({ list: mints }).then(whitelisted => {

                            let nftsMap: { [key: string]: Nft } = {}

                            for (let snft of nftsInfo.items) {
                                nftsMap[snft.address.toBase58()] = snft;
                            }


                            let whitelistedResult = [];

                            for (let white of whitelisted.list) {


                                const nftInfoExtended = nftsMap[white.address]

                                let n: Nft = white as any;
                                n.address = new PublicKey(white.address);
                                n.tokenAcc = mintToTokenacc[white.address];

                                if (nftInfoExtended != undefined) {
                                    n.image = nftInfoExtended.image
                                    n.name = nftInfoExtended.name
                                    n.collectionName = nftInfoExtended.collectionName
                                }

                                whitelistedResult.push(n);
                            }

                            if (whitelistedResult.length == 0) {
                                // toast.info('no whitelisted nfts')
                                // // setCurrentModal("");
                            }

                            setNfts(whitelistedResult);
                        })
                        // })

                    }).catch(e => {
                        toast.warn("unable to load your nfts")
                    })

                }).finally(() => {
                    setLoading(false);
                })


                // console.log('nfts by user: ',JSON.stringify(nftList))


            }
        } else {
            setNfts([]);
        }
    }, [currentWallet, connected, isOpen])

    useEffect(() => {
        forceReloadNfts();
    }, [forceReloadNfts])

    useEffect(() => {
        if (currentModal == "betmodal") {
            onOpen();
        } else {
            onClose();
        }
    }, [currentModal])

    const nftSelectorContent = useMemo(() => {
        // if (nfts.length > 0) {
        return <NftsSelector
            maxChunk={maxSelection}
            items={nfts}
            actionHandler={betSelectedItems}
            actionLabel={<>Make a bet</>}
        />
        // } else {
        //     return <Grid gap={4} height="60vh" overflow="auto">
        //         <EmptyRow></EmptyRow>
        //     </Grid>;
        // }
    }, [nfts]);

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={() => {
                    setCurrentModal("")
                }}
                isCentered
                size="5xl"
            >
                <ModalOverlay />
                <ModalContent
                    backgroundColor={styles.chat_even}
                    color={styles.color}
                    height="95vh"
                    overflow="auto"
                >
                    <ModalHeader>
                        <Flex alignItems="center">
                            <Button variant="info" onClick={forceReloadNfts} backgroundColor={styles.chatSendBtn}> <RepeatIcon color={styles.makeBetBtnColor} /> </Button>
                            <Flex direction="column">
                                <Text>NFT in your wallet</Text>
                                <Text fontSize={"10px"}>{currentWallet?.toBase58()}</Text>
                            </Flex>
                        </Flex>

                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={12} alignItems="center" >
                        {loading ?
                            <>
                                <Box position="relative">
                                    <Text textAlign="center">Loading ...</Text>
                                    <EmptyRow skeleton={true}></EmptyRow>
                                </Box>
                            </> : nftSelectorContent}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}


async function betSelectedItems(
    wallet: WalletAdapter,
    app: AppContextType,
    nfts: Nft[],
    solValue: number,
    // solanaConnection: SolanaRpc,
    selectedItems: { [key: string]: boolean }
): Promise<any> {

    const { api, game, currentWallet, signTransaction, setCurrentModal } = app;

    const mints = mapToArray(selectedItems);

    // generate tx 
    const escrowPk = new PublicKey(game.game.escrow);

    const connection = new Connection(GlobalConfig.rpcTx);

    let ixs = [];

    for (let mint of mints) {
        const mintObject = new PublicKey(mint);

        let sourceAssoc: any = null;

        for (let sourceNft of nfts) {
            if (sourceNft.address.equals(mintObject)) {
                sourceAssoc = new PublicKey(sourceNft.tokenAcc);
            }
        }

        if (sourceAssoc == null) {
            sourceAssoc = getAssociatedTokenAddressSync(mintObject, currentWallet)
        }

        const destAssoc = getAssociatedTokenAddressSync(mintObject, escrowPk)


        // check if account exists
        const accInfo = await connection.getAccountInfo(destAssoc)
        if (accInfo == null) {
            const destCreateIx = createAssociatedTokenAccountInstruction(currentWallet, destAssoc, escrowPk, mintObject);
            ixs.push(destCreateIx);
        } else {
            toast.info("NO acc need to be created")
        }

        const transferIx = createTransferInstruction(sourceAssoc, destAssoc, currentWallet, 1);
        ixs.push(transferIx);
    }

    let betLamports = solValue * LAMPORTS_PER_SOL;

    // toast.info('adding extra '+ solValue + " to bet")

    ixs.push(SystemProgram.transfer({
        fromPubkey: currentWallet,
        toPubkey: escrowPk,
        lamports: GlobalConfig.betFee + betLamports
    }))

    connection.getLatestBlockhash().then(bh => {
        const txInitArgs: TransactionBlockhashCtor = {
            blockhash: bh.blockhash,
            lastValidBlockHeight: bh.lastValidBlockHeight,
            feePayer: currentWallet,
        }
        const tx = new Transaction(txInitArgs)
        tx.add(...ixs)

        signTransaction(tx).then(signed => {
            const sigStr = bs58.encode(signed.signatures[0].signature)

            const serializedTx = tx.serialize()
            const serializedTxString = serializedTx.toString('base64')

            const lamport = solValue * LAMPORTS_PER_SOL;

            const betArgs: BetArgs = {
                signatures: [sigStr],
                mints: mints,
                game_uid: game.game.uid,
                sol_value: lamport,
            }

            api.bet(betArgs).then((response) => {

                connection.sendEncodedTransaction(serializedTxString).then(sig => {
                    console.log("tx sent : ", sig)
                }).catch(e => {
                    console.log('unable to send transaction', e)
                    toast.warn("unable to send transaction, try again later")
                }).finally(() => {
                    setCurrentModal("")
                })

            }).catch(e => {
                handleApiError(e, (code, msg) => {
                    toast.error("unable to bet: " + msg)
                    setCurrentModal("")
                })
            })

        }).catch(e => {
            toast.warn('unable to sign a transaction: ' + e.message)
        })

    }).catch(e => {
        toast.warn("solana rpc error. try again later")
    })
}