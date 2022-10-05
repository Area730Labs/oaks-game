import { FormControl, FormLabel, Input, 
    Modal, ModalBody, ModalCloseButton, ModalContent,
     ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure, Image } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useApp } from "../AppContext"
import { toast } from 'react-toastify'
import { UserType } from "../../interfaces/user"
import { useStyle } from "../StyleContext"
import { Button } from "../override/Button"

export default function WinnerDialog() {

    const { styles } = useStyle();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { currentModal, api, setCurrentModal, user, setUser } = useApp();

    const initialRef = React.useRef(null)

    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        if (currentModal == "winnerdialog") {
            onOpen();
        } else {
            onClose();
        }
    }, [currentModal])


    // function saveUser() {

    //     if (user != null) {

    //         user.username = username

    //         api.update(user as UserType).then((newUser) => {
    //             setUser(newUser)
    //             toast.success('Profile updated')
    //         }).catch((e) => {
    //             toast.error("unable to update user data: ", e.message)
    //         })
    //         setCurrentModal("");
    //     } else {
    //         toast.warn("something goes wrong, reload page")
    //     }
    // }

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
                size='2xl'
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    backgroundColor={styles.chat_even}
                    color={styles.color}
                >
                    {/* <ModalHeader textAlign='center'>You won!</ModalHeader> */}
                    <ModalCloseButton />
                    <ModalBody
                        pb={6}
                    >

                        <Image src="/icons/winner.png"/>
                      
                    </ModalBody>

                    <ModalFooter>
                        
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}