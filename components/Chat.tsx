import { Box } from "@chakra-ui/react";
import { ChatMessageObject } from "../interfaces/ChatMessage";
import { ChatMessage } from "./ChatMessage";

export function Chat() {

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
            body : "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
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
            body : "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
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
            body : "id aliquet lectus proin nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus",
            username: "Roz2007"
        },

    ];

    return <>
        <Box 
        >
            {chatItems.map((it) => {
                return <ChatMessage message={it} />
            })}
        </Box>
    </>
}