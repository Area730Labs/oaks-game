import { Box, Button, ChakraProps, Flex, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useStyle } from "./StyleContext";
import { useApp } from "./AppContext";
import { Children } from "react";
export interface MenuButtonProps extends ChakraProps {
    label: any,
    url?: string,
    modal?: string,
    children: React.ReactNode,
    withIcon: boolean
}

export function MenuButton(props: MenuButtonProps) {

    const { styles } = useStyle();
    const { children, label, url,modal, withIcon, ...rest } = props;

    const { setCurrentModal } = useApp();

    const onclick = () => {
        if (modal) {
            setCurrentModal(modal);
        }
        
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const txtColor = withIcon  ? styles.navColorWithIcons: styles.menuColor ;

    return (<Box
        color={txtColor}
        textTransform="uppercase"
        fontFamily="GolosUI"
        fontWeight="400"
        cursor="pointer"
        // _hover={{ backgroundColor: styles.chatSendBtn }}
        padding="10px 15px"
        borderRadius="99px"
        transition=".2s all ease"
        role="group"
        onClick={onclick}
        {...rest}
    >
        <Flex>
            <Box
                color={styles.menuIcon}
                // _groupHover={{ color: styles.menuIconHover }}
                fontSize="22px"
            >
                {children} {/* icon? */}
            </Box>
            <Text paddingLeft="10px">
                {label}
            </Text>
        </Flex>
    </Box >)
}




