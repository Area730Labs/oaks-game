import { Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Toast, useDisclosure } from "@chakra-ui/react"
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
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

export default function Stats() {

    const { styles } = useStyle();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { currentModal, api, setCurrentModal, user, setUser } = useApp();

    const initialRef = React.useRef(null)


    useEffect(() => {
        if (currentModal == "stats") {
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
                size='3xl'
                isCentered
                
            >
                <ModalOverlay />
                <ModalContent
                    backgroundColor={styles.chat_even}
                    color={styles.color}
                    height='300px'
                    
                >
                    <ModalHeader>Statistics</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        pb={6}
                        textAlign='center'
                        verticalAlign='middle'
                    >

                        <Flex direction='column' height='100%'>
                        <Spacer/>
                        <Box marginTop='-45px'><Text fontSize='30px'>Coming soon</Text></Box>
                        <Spacer/>
                        </Flex>
                        
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}