import { FormControl, FormLabel, Input, 
    Modal, ModalBody, ModalCloseButton, ModalContent,
     ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure, Image, Box, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useApp } from "../AppContext"
import { toast } from 'react-toastify'
import { UserType } from "../../interfaces/user"
import { useStyle } from "../StyleContext"
import { Button } from "../override/Button"
import { SvgComponent } from "./LostDialog"


export default function WinnerDialog() {
    const { styles } = useStyle();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { currentModal, api, setCurrentModal, user, setUser, game } = useApp();

    const initialRef = React.useRef(null)
    const [nftCount, setNftCount] = useState<number>(0);
    const [solAmount, setSolAmount] = useState<number>(0);

    useEffect(() => {
        if (currentModal == "winnerdialog") {
            setNftCount(game.game.nfts_count);
            setSolAmount(game.game.total_floor_value);

            onOpen();
        } else {
            onClose();
        }
    }, [currentModal])


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
                    backgroundColor={styles.lostDialogBg}
                    border={`2px solid ${styles.winDialogColor}`}
                    color={styles.color}
                    maxW='560px'
                    h='260px'
                    overflow='hidden'
                >
                    <Box position='absolute' width='388px' height='370px' left='84px'>
                        <SvgComponent width='100%' height='100%' />
                    </Box>
                    <ModalBody
                        pb={6}
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        gap='10px'
                    >
                    
                    <Box>
                    <Text width='100%'  color={styles.winDialogColor} fontSize='42px'>YOU'RE THE WINNER</Text>
                    </Box>
                    <Box>
                    <Text width='100%' color={styles.lostDialogSubColor} fontSize='16px'>Congratulations! {nftCount} NFTs <span style={{color: '#32C745'}}>({solAmount} $SOL)</span> are yours now</Text>

                    </Box>
                        
                      
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}