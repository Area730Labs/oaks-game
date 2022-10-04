import { Box, Flex } from "@chakra-ui/react";
import { useApp } from "./AppContext";
import { useStyle } from "./StyleContext"
import { UserInfoBlock } from "./UserInfoBlock";

export function MainBetsInfo() {

    const { styles } = useStyle();
    const { setCurrentModal, user } = useApp();

    function makeBetHandler() {
        setCurrentModal("betmodal");
    }

    return <>
        <Flex
            gap="30px"
            width="350px"
            height="53px"
            marginLeft="20px"
            marginTop="20px"
        >
            {user ? <UserInfoBlock user={user} /> : null}
            <Flex
                cursor="pointer"
                padding={"12px 24px"}
                backgroundColor={styles.chatSendBtn}
                width={"128px"}
                textTransform="uppercase"
                borderRadius={"6px"}
                fontSize="13px"
                lineHeight="17px"
                display="flex"
                gap="10px"

                flex="none"
                order="1"
                flexGrow="0"
                flexDirection="row"
                alignItems="center"

                color={styles.makeBetBtnColor}
                onClick={makeBetHandler}
            >
                Make a bet
            </Flex>
        </Flex>
    </>
}