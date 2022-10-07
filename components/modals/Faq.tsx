import { FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useApp } from "../AppContext"
import { toast } from 'react-toastify'
import { UserType } from "../../interfaces/user"
import { useStyle } from "../StyleContext"
import { Button } from "../override/Button"
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text
  } from '@chakra-ui/react'


export default function Faq() {

    const { styles } = useStyle();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { currentModal, api, setCurrentModal, user, setUser } = useApp();

    const initialRef = React.useRef(null)


    useEffect(() => {
        if (currentModal == "faq") {
            onOpen();
        } else {
            onClose();
        }
    }, [currentModal])


    // {
    //     'q': '',
    //     'a': ''
    // }

    const qa = [
        {
            'q': 'I won, how do I get my NFTs?',
            'a': 'The NFTs you won will be automatically sent to your wallet after the game is over'
        },
        {
            'q': 'How is my win chance calcualted?',
            'a': 'Win chance is proportional to the value of NFTs you bet. The value is calculated based on floor price.'
        }
    ]

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={() => {
                    setCurrentModal("");
                }}
                size='3xl'
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    backgroundColor={styles.chat_even}
                    color={styles.color}
                >
                    <ModalHeader>FAQ</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        pb={6}
                    >

                        <Accordion>
                            {qa.map((item, index) => {
                                return (<AccordionItem key={index}>
                                    <h2>
                                        <AccordionButton>
                                            <Box flex='1' textAlign='left'>
                                            <Text fontWeight='bold'>{item.q}</Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                    <Text>{item.a}</Text>
                                        </AccordionPanel>
                                    </AccordionItem>)
                            })}

                        
                        </Accordion>
                        
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}