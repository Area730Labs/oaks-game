import { FormControl, Divider, Text, FormLabel, Box, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useApp } from "../AppContext"
import { toast } from 'react-toastify'
import { UserType } from "../../interfaces/user"
import { useStyle } from "../StyleContext"
import { Button } from "../override/Button"
import { Grid } from "@chakra-ui/layout";
import { NftImage } from "../Bet"
import Nft from "../../interfaces/nft"
import { useWallet } from "@solana/wallet-adapter-react"
import { getAllNfts, getNftsByUser } from "../../utils";
import { PublicKey } from "@solana/web3.js"


export default function UserModal() {

    const { styles } = useStyle();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { currentModal, api, setCurrentModal, user, setUser, currentWallet, imageCache, setImageCache } = useApp();

    const initialRef = React.useRef(null)

    const [username, setUsername] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const { connected } = useWallet();

    const [nfts, setNfts] = useState([]);

    const updateNfts = async() => {
        if (!connected || !currentWallet) {
            return;
        }

        try {
            const nftList = await getNftsByUser(currentWallet);

            let mints = [];
            for (let n of nftList) {
                mints.push(n.address);
            }

            setNfts(mints);
        } catch(e) {

        } finally {
            setLoading(false);
        }
    };

    


    useEffect(() => {
        if (currentModal == "useredit") {
            setUsername(user.username);
            if (user.image) {
                setAvatarUrl(user.image);
            } else {
                setAvatarUrl('/icons/avatar.png');
            }

            setLoading(true);
            setNfts([]);
            updateNfts();

            onOpen();
        } else {
            onClose();
        }
    }, [currentModal])


    function saveUser() {
        if (user != null) {
            user.username = username
            user.image = avatarUrl;

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

    const gridData = [];

    const setImage = async(url) => {
        setAvatarUrl(url);
    };

    nfts.map((item, index) => {
        gridData.push(<NftImage mint={item} key={index} onClick={setImage} />)
    });

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={() => {
                    setCurrentModal("");
                }}
                size='2xl'
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    backgroundColor={styles.chat_even}
                    color={styles.color}
                    height='500px'
                >
                    <ModalHeader>Profile config</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        pb={6}
                        height='300px'
                    >
                        <Flex dir='row' alignItems='center' gap='10px'>
                            <Image width='100px' borderRadius='10px' src={avatarUrl} />

                            <FormControl display='flex'>
                                <FormLabel lineHeight='40px'>Username</FormLabel>
                                <Input value={username} style={{border: `1px solid ${styles.username}`}} onChange={(e: any) => {
                                    setUsername(e.target.value)
                                }} ref={initialRef} placeholder='username' />
                            </FormControl>
                        </Flex>

                        <Divider marginTop='10px' borderColor={styles.username}/>

                        <Box marginTop='10px' height='70%' overflowY='scroll' sx={{
                    "::-webkit-scrollbar": {
                        display: "none",
                    },
                }}>
                    {loading && <Text>Loading...</Text>}
                            <Grid gap={4} templateColumns={['repeat(3, 1fr)', 'repeat(4,1fr)', 'repeat(5, 1fr)']}>
                                {gridData}
                            </Grid>
                        </Box>


                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={saveUser} mr={3}>
                            Save
                        </Button>
                        <Button
                            variant={'info'}
                            onClick={() => {
                                setCurrentModal("");
                            }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}