import { Box, Button, ChakraProps, Flex, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useStyle } from "./StyleContext";


export interface MenuButtonProps extends ChakraProps {
    label: any,
    url?: string,
    children: React.ReactNode
}

export function MenuButton(props: MenuButtonProps) {

    const { styles } = useStyle();
    const { children, label, url, ...rest } = props;

    const onclick = () => {
        if (!url) {
            return;
        }
        
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (<Box
        color={styles.menuColor}
        textTransform="uppercase"
        fontFamily="GolosUI"
        fontWeight="400"
        cursor="pointer"
        _hover={{ backgroundColor: styles.chatSendBtn }}
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
                _groupHover={{ color: styles.menuIconHover }}
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




