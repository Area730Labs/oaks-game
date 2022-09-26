import { Box, Button, Flex, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useStyle } from "./StyleContext";

export function MenuButton(props: { label: any, children: JSX.Element }) {

    const { styles } = useStyle();

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
    >
        <Flex>
            <Box
                color={styles.menuIcon}
                _groupHover={{color:styles.menuIconHover}}
                fontSize="22px"
            >
                {props.children} {/* icon? */}
            </Box>
            <Text paddingLeft="10px">
                {props.label}
            </Text>
        </Flex>
    </Box >)
}




