import { Box, Button, Img, Input } from "@chakra-ui/react";
import { useState } from "react";
import { ChatMessageObject } from "../interfaces/ChatMessage";
import { ChatMessage } from "./ChatMessage";
import { useStyle } from "./StyleContext";

import sendBtnImage from "../public/icons/send-btn.png";
import { SendImg } from "./Icons";

const sendBtnSize = "30px";

function ChatInput() {

    const { styles } = useStyle();

    const [message, setMessage] = useState("");

    const inputTextHandler = (e: any) => {
        setMessage(e.target.value);
    }

    function sendMessageHandler(msg: string) {
        alert("sending a message " + message)
    }

    const inputHandler = (e: any) => {
        if (e.key == "Enter") {
            sendMessageHandler(message);
            setMessage("")
        }
    }

    const outlineConfig = { outline: "none!important", border: "none!important" };


    return (<Box
        display="flex"
        flexDirection="row"
        backgroundColor={styles.chatInput}
        height="60px"
        style={{ boxShadow: styles.shadowTop }}
        paddingLeft="10px"
        paddingTop="15px"
    >
        <Box>
            <Input
                placeholder="Type here..."
                borderRadius="99px"
                width="164px"
                backgroundColor={styles.chatInputBg}
                border="none"
                _focus={outlineConfig}
                _active={outlineConfig}
                fontSize="10px"
                outline={"none!important"}
                height="30px"
                onKeyDown={inputHandler}
                onChange={inputTextHandler}
                value={message}
            />
        </Box>
        <Box
            marginLeft="10px"
            width={sendBtnSize}
            boxSizing="border-box"
            height={sendBtnSize}
            fontFamily="GolosUI"
            borderRadius="99px"
            backgroundColor={styles.chatSendBtn}
            onClick={() => {
                sendMessageHandler(message);
            }}
            position="relative"
        >
            <SendImg position="absolute" top="7px" left="8px"/>
        </Box>
    </Box>)
}

export function Chat() {

    const { styles } = useStyle();

    const chatItems: ChatMessageObject[] = [
        {
            body: "Hendrerit gravida rutrum quisque non",
            username: "Elon2022"
        },
        {
            body: "tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt",
            username: "Rogoz2007"
        },
        {
            body: ":)",
            username: "Lelon2015"
        },
        {
            body: "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
            username: "Roz2007"
        },
        {
            body: "tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt",
            username: "Rogoz2007"
        },
        {
            body: ":)",
            username: "Lelon2015"
        },
        {
            body: "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
            username: "Roz2007"
        },
        {
            body: "tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt",
            username: "Rogoz2007"
        },
        {
            body: "Hello",
            username: "Lelon2015"
        },
        {
            body: "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
            username: "Roz2007"
        },

    ];

    return <>
        <Box
            display="flex"
            flexDirection="column"
        >
            <Box
                flexGrow="1"
                display="flex"
                flexDirection="column"
                // height={"100vh"}
                height="calc(100vh - 130px)"
                overflowY="scroll"
            >
                {chatItems.map((it) => {
                    return <ChatMessage message={it} />
                })}
            </Box>
            <ChatInput />
        </Box>
    </>
}