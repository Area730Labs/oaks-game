import { Box } from "@chakra-ui/react";
import { ChatMessageObject } from "../interfaces/ChatMessage";
import { useStyle } from "./StyleContext";
import { Username } from "./Username";

export function ChatMessage(props: {message: ChatMessageObject}) {

    const {styles} = useStyle();

    return <Box
            padding="15px 10px"
            gap="10px"
            fontFamily="GolosUi"
            fontWeight="400"
            _even={{
                backgroundColor: styles.chat_even
            }}
        >
        <Username>{props.message.username}</Username>
        <Box
            fontSize="10px"
            width="95%"
        >
            {props.message.body}
        </Box>
    </Box>
}