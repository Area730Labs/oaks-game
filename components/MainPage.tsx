import { Box, Button, Flex, List, ButtonGroup, Img } from '@chakra-ui/react'
import { Chat } from './Chat';
import { ChatContextProvider } from './ChatContext';
import { BetsHistory, History } from './BetsHistory';
import { FaqImg, StatsImg, TopImg, WalletImg } from './Icons';
import { MenuButton } from './MenuButton';
import { Navigation } from './Navigation';
import { useStyle } from './StyleContext'

export function MainPage() {

    const { styles, toggleTheme } = useStyle()

    return (<Box position="relative" backgroundColor={styles.bg}>
        <Button
            position="absolute"
            top="20px"
            left="20px"
            onClick={toggleTheme}
            zIndex="11"
        >Toggle theme</Button>

        <Flex
            zIndex="10"
            bg={styles.header}
            style={{ boxShadow: "0px -5px 30px rgba(0, 0, 0, 0.5)" }}
            height="70px"
            flexDirection="column"
            justifyContent="center"
        >
            <Navigation />
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
                <ChatContextProvider>
                    <Chat />
                </ChatContextProvider>
            </Box>
            <Box
                flexGrow="1"
            >
            </Box>
            <Box
                bg={styles.chat_even}
                width="300px"
            >
                <BetsHistory />
            </Box>
        </Box>
    </Box >)
}