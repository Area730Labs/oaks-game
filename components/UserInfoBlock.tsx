import { Box, Flex, Img, Text } from "@chakra-ui/react";
import { UserType } from "../interfaces/user";
import { useStyle } from "./StyleContext";

export function UserInfoBlock(props: { user: UserType }) {

    const { styles } = useStyle();

    const avatarBorder = "2px solid " + styles.chatSendBtn

    const betdepositvalue = 0;
    const chance = 5.3;


    return <Flex
        flexDirection="row"
        alignItems="center"
        gap="10px"
    >
        <Box
            width="53px"
            height="53px"
            borderRadius="99px"
            overflow="hidden"
            border={avatarBorder}
            boxSizing="border-box"
        >
            <Img src={props.user.image} />
        </Box>
        <Flex
            direction="column"
            gap="5px"
            alignItems="flex-start"
        >
            <Box
                fontSize="12px"
                fontWeight="bold"
                color={styles.meUsername}
            >{props.user.username}
            </Box>
            <Flex direction="column" fontSize="10px" gap="5px" fontFamily="GolosUI" fontWeight="400">
                <Box>Deposited: <Text display="inline" color={styles.betInfoValue} fontWeight="600">{betdepositvalue}</Text></Box>
                <Box>Your chance: <Text display="inline" fontWeight="600" color={styles.betInfoValue}>{chance}%</Text></Box>
            </Flex>
        </Flex>

    </Flex>
}