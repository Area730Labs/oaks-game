import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useApp } from "./AppContext"
import { toast } from 'react-toastify'
import { UserType } from "../interfaces/user"

export default function UserModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { currentModal, api, setCurrentModal, user, setUser } = useApp();

    const initialRef = React.useRef(null)

    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        if (currentModal == "useredit") {
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

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input value={username} onChange={(e: any) => {
                                setUsername(e.target.value)
                            }} ref={initialRef} placeholder='username' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={saveUser} mr={3}>
                            Save
                        </Button>
                        <Button onClick={() => {
                            setCurrentModal("");
                        }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}