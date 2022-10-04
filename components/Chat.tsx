import { Box, Input, Toast } from "@chakra-ui/react";
import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { useStyle } from "./StyleContext";

import { SendImg } from "./Icons";
import { useChat } from "./ChatContext";
import { useApp } from "./AppContext";
import { toast } from "react-toastify"

const sendBtnSize = "30px";

function ChatInput() {

    const { styles } = useStyle();

    const { api } = useApp();

    const [message, setMessage] = useState("");

    const inputTextHandler = (e: any) => {
        setMessage(e.target.value);
    }

    function sendMessageHandler(msg: string) {

        if (!api.hasAuth()) {
            toast.warn('connect wallet first');
        } else {
            api.sendMessage(msg)
            setMessage("")
        }
    }

    const inputHandler = (e: any) => {
        if (e.key == "Enter") {
            sendMessageHandler(message);
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
            <SendImg position="absolute" top="7px" left="8px" />
        </Box>
    </Box>)
}

export function Chat() {

    const { styles } = useStyle();
    const { history } = useChat();

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
                {history ? history.map((it) => {
                    return <ChatMessage message={it} />
                }) : null}
            </Box>
            <ChatInput />
        </Box>
    </>
}