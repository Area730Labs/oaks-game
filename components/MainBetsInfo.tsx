import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "react-toastify";
import { useApp } from "./AppContext";
import { useStyle } from "./StyleContext"
import { UserInfoBlock } from "./UserInfoBlock";

export function MainBetsInfo() {

    const { styles } = useStyle();
    const { setCurrentModal, user, game } = useApp();
    const { connected } = useWallet();
    const {setVisible} = useWalletModal();

    function makeBetHandler() {
        if (!connected) {
            setVisible(true);
            // todo add callback after connection ?
        } else {
            setCurrentModal("betmodal");
        }
    }

    return <>
        <Flex
            gap="30px"
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

                flexGrow="0"
                flexDirection="row"
                alignItems="center"

                color={styles.makeBetBtnColor}
                onClick={makeBetHandler}
            >
                Make a bet
            </Flex>
            
            <Spacer/>

            <Flex direction='row' marginRight='-15px' gap='5px'>
                <Box backgroundImage='url(/icons/user-profile.png)' width='20px' height='20px' marginTop='17px'/>
                <Text lineHeight='53px' fontSize='16px' color={styles.betInfoValue}>{game?.players?.length}</Text>
                <Text lineHeight='53px' fontSize='16px' fontWeight='normal'>Players</Text>
            </Flex>

            <Flex direction='row' marginRight='15px' gap='5px'>
                <Box backgroundImage='url(/icons/online.png)' width='20px' height='20px' marginTop='17px'/>
                <Text lineHeight='53px' fontSize='16px' color={styles.betInfoValue}>{game.online}</Text>
                <Text lineHeight='53px' fontSize='16px' fontWeight='normal'>Watching</Text>
            </Flex>
            
        </Flex>
    </>
}