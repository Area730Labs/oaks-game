import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useMemo, useState } from "react"
import { useApp } from "../AppContext"
import { toast } from 'react-toastify'
import { UserType } from "../../interfaces/user"
import { useStyle } from "../StyleContext"
import { Button } from "../override/Button"
import EmptyRow from "../nft/emptyrow"
import {WalletAdapter} from "@solana/wallet-adapter-base"
import NftsSelector from "../nft/nftselector"
import Nft from "../../interfaces/nft"
import { useWallet } from "@solana/wallet-adapter-react"
import { getNftsByUser } from "../../utils"

export default function NftSelectorModal() {

    const maxSelection = 5;


    const { styles } = useStyle();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {connected} = useWallet();
    const { currentModal, api, setCurrentModal, user, setUser,currentWallet } = useApp();
    const initialRef = React.useRef(null)
    const [username, setUsername] = useState<string>("");
    const [nfts,setNfts] = useState<Nft[]>([]);

    useEffect(() => {
        if (connected) {
            getNftsByUser(currentWallet).then((nftList) => {
                setNfts(nftList);
            }).catch(e => {
                toast.warn("unable to load your nfts")
            })
        } else {
            setNfts([]);
        }

    },[currentWallet,connected])

    useEffect(() => {
        if (currentModal == "betmodal") {
            onOpen();
        } else {
            onClose();
        }
    }, [currentModal])

    function saveUser() {

        if (user != null) {

            user.username = username

            api.update(user as UserType).then((newUser) => {
                setUser(newUser)
                toast.success('Profile updated')
            }).catch((e) => {
                toast.error("unable to update user data: ", e.message)
            })
            setCurrentModal("");
        } else {
            toast.warn("something goes wrong, reload page")
        }
    }

    const nftSelectorContent = useMemo(() => {
        if (nfts.length > 0) {
            return <NftsSelector
                maxChunk={maxSelection}
                items={nfts}
                actionHandler={betSelectedItems}
                actionLabel={<>Make a bet</>}
            />
        } else {
            return null;
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
                size="3xl"
            >
                <ModalOverlay />
                <ModalContent
                    backgroundColor={styles.chat_even}
                    color={styles.color}
                >
                    <ModalHeader>Your NFTS</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={12}>
                        <EmptyRow></EmptyRow>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            onClick={saveUser}>
                            Deposit
                        </Button>
                        <Button variant="info" onClick={() => {
                            setCurrentModal("");
                        }}>Cancel</Button>
                    </ModalFooter>
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