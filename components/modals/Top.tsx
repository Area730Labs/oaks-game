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

export default function Top() {

    const { styles } = useStyle();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { currentModal, api, setCurrentModal, user, setUser } = useApp();

    const initialRef = React.useRef(null)


    useEffect(() => {
        if (currentModal == "top") {
            onOpen();
        } else {
            onClose();
        }
    }, [currentModal])

    const data = [
        
    ]

    for(let i = 0; i < 30; ++i) {
        data.push({
            'wallet': '44KC9xtX2yD8bne2z942VnCPKGJ3cjreTis1BffypWA2',
            'total': i * 100 + 145
        })
    }

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
                    height='80%'
                    
                >
                    <ModalHeader>Top winners</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        pb={6}
                        overflow='scroll'
                    >

                        <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>Top winners</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th>Wallet</Th>
                                    <Th isNumeric>Total</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((item, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td width='15px'>{index + 1}</Td>
                                            <Td>{item.wallet}</Td>
                                            <Td isNumeric>{item.total} SOL</Td>
                                        </Tr>
                                    )
                                })}
                                
                                
                            </Tbody>
                        </Table>
                        </TableContainer>
                        
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}