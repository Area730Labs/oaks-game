import { Box, Flex, Img, Text } from "@chakra-ui/react";
import { UserType } from "../interfaces/user";
import { useStyle } from "./StyleContext";
import { useApp } from "./AppContext";
import { PublicKey } from "@solana/web3.js";


export function UserInfoBlock(props: { user: UserType }) {

    const { styles } = useStyle();
    const {game: {players, game, bets}, currentWallet, setCurrentModal, } = useApp();

    const avatarBorder = "2px solid " + styles.chatSendBtn

    let betdepositvalue = 0;
    let chance = 0;

    bets.map((bet) => {
        if (!currentWallet) {
            return;
        }

        if (bet.user.wallet == currentWallet.toString()) {
            chance = (Math.floor((bet.value * 100 / game.total_floor_value * 100)) / 100);
            chance = parseFloat(chance.toFixed(2))
            betdepositvalue = parseFloat(bet.value.toFixed(2));
        }
    });


    let userImg = props.user.image;
    if (!userImg) {
        userImg = '/icons/avatar.png'
    }

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
            cursor='pointer'
            onClick={() => setCurrentModal("useredit")}
        >
            <Img src={userImg} />
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