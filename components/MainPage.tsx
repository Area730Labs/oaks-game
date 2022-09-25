import { Box, GridItem, Grid, Button, Flex } from '@chakra-ui/react'
import { Chat } from './Chat';
import { History } from './History';
import { useStyle } from './StyleContext'

export function MainPage() {

    const { styles, toggleTheme } = useStyle()

    return (<Box position="relative" backgroundColor={styles.bg}>
        <Button
            position="absolute"
            top="20px"
            right="20px"
            onClick={toggleTheme}
            zIndex="11"
        >Toggle theme</Button>

        <Flex
            zIndex="10"
            bg={styles.header}
            style={{ boxShadow: "0px -5px 30px rgba(0, 0, 0, 0.5)" }}
            height="70px">
        </Flex>
        <Box
            zIndex="5"
            color={styles.color}
            fontWeight='bold'
            display="flex"
        >

            <Box
                alignSelf="flex-end"
                bg={styles.chat}
                width="226px"
                boxShadow={styles.shadowRight}
            >
                <Chat/>
            </Box>
            <Box
                flexGrow="1"
            >
            </Box>
            <Box
                bg={styles.chat_even}
                width="300px"
            >
                <History/>
            </Box>
        </Box>
    </Box >)
}