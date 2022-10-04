import { Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text, Box } from "@chakra-ui/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useApp } from "../AppContext"
import { toast } from 'react-toastify'
import { UserType } from "../../interfaces/user"
import { useStyle } from "../StyleContext"
import { Button } from "../override/Button"
import EmptyRow from "../nft/emptyrow"
import { WalletAdapter } from "@solana/wallet-adapter-base"
import NftsSelector from "../nft/nftselector"
import Nft from "../../interfaces/nft"
import { useWallet } from "@solana/wallet-adapter-react"
import { getNftsByUser } from "../../utils"
import { RepeatIcon } from "@chakra-ui/icons"

export default function NftSelectorModal() {

    const maxSelection = 5;

    const { styles } = useStyle();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { connected } = useWallet();
    const { currentModal, api, setCurrentModal, user, setUser, currentWallet } = useApp();
    const initialRef = React.useRef(null)
    const [nfts, setNfts] = useState<Nft[]>([]);

    const [loading, setLoading] = useState(false);

    const forceReloadNfts = useCallback(() => {
        if (connected) {

            setLoading(true);
            getNftsByUser(currentWallet).then((nftList) => {
                setNfts(nftList);
            }).catch(e => {
                toast.warn("unable to load your nfts")
            }).finally(() => {
                setLoading(false);
            })
        } else {
            setNfts([]);
        }
    }, [currentWallet, connected])

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
        if (nfts.length > 0) {
            return <NftsSelector
                maxChunk={maxSelection}
                items={nfts}
                actionHandler={betSelectedItems}
                actionLabel={<>Make a bet</>}
            />
        } else {
            return <Grid gap={4} height="60vh" overflow="auto">
                <EmptyRow></EmptyRow>
            </Grid>;
        }
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
                        <Button variant="info" onClick={forceReloadNfts}> <RepeatIcon /> </Button>
                        NFT in your wallet
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
    // solanaConnection: SolanaRpc,
    selectedItems: { [key: string]: boolean }
): Promise<any> {

    toast.info("betting selected items : ")

    return 0;

    // let instructions = [] as TransactionInstruction[];

    // for (var it in selectedItems) {
    //     instructions.push(createStakeNftIx(staking, new PublicKey(it), wallet as WalletAdapter));
    // }

    // return sendTx(instructions, 'stake').catch((e) => {
    //     toast.error(`Unable to stake: ${e.message}`)
    // });
}