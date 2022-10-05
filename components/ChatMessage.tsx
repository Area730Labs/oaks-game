import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { MsgType } from "../interfaces/msg";
import { useChat } from "./ChatContext";
import { useStyle } from "./StyleContext";
import { Username } from "./Username";

export function ChatMessage(props: {message: MsgType, key: any}) {

    const {styles} = useStyle();
    const {usernames} = useChat();

    const username = useMemo(() => {
        return usernames[props.message.sender]
    },[usernames])


    return <Box
            padding="15px 10px"
            gap="10px"
            fontFamily="GolosUi"
            fontWeight="400"
            _even={{
                backgroundColor: styles.chat_even
            }}
        >
        <Username>{username}</Username>
        <Box
            fontSize="10px"
            width="95%"
        >
            {props.message.contents}
        </Box>
    </Box>
}