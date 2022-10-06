import { Box, Flex, Img, Text } from "@chakra-ui/react";
import { UserType } from "../interfaces/user";
import { useStyle } from "./StyleContext";
import { useApp } from "./AppContext";
import { PublicKey } from "@solana/web3.js";

export function UserInfoBlock(props: { user: UserType }) {

    const { styles } = useStyle();
    const {game: {players, game, bets}, currentWallet} = useApp();

    const avatarBorder = "2px solid " + styles.chatSendBtn

    let betdepositvalue = 0;
    let chance = 0;

    bets.map((bet) => {
        if ((new PublicKey(bet.user.wallet)) == currentWallet) {
            chance = (Math.floor((bet.value * 100 / game.total_floor_value * 100)) / 100);
            betdepositvalue = bet.value;
        }
    });


    let userImg = props.user.image;
    userImg = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'

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