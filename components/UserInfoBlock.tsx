import { Box, Flex, Img, Text } from "@chakra-ui/react";
import { UserType } from "../interfaces/user";
import { useStyle } from "./StyleContext";
import { useApp } from "./AppContext";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";


export function UserInfoBlock(props: { user: UserType }) {

    const { styles } = useStyle();
    const {game: {players, game, bets}, currentWallet, setCurrentModal, } = useApp();
    const [val, setVal] = useState(0);
    const [chance, setChance] = useState(0);

    const avatarBorder = "2px solid " + styles.chatSendBtn;



    useEffect(() => {
        let newVal = 0;

        bets.map((bet) => {
            if (!currentWallet) {
                return;
            }
    
            if (bet.user.wallet == currentWallet.toString()) {
                newVal += bet.value;
            }
        });
    
        if (newVal > 0 && game.unconfirmed_bets_count == 0 && game.unconfirmed_nfts_count == 0) {
            let c = (((newVal * 100 / game.total_floor_value * 100)) / 100);
            setVal(newVal);
            setChance(c);
        }

        if (!bets || bets.length == 0){
            setVal(0);
            setChance(0);
        }
    }, [game, bets])

    
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
                <Box>Deposited: <Text display="inline" color={styles.betInfoValue} fontWeight="600">{val.toFixed(2)}</Text></Box>
                <Box>Your chance: <Text display="inline" fontWeight="600" color={styles.betInfoValue}>{chance.toFixed(2)}%</Text></Box>
            </Flex>
        </Flex>

    </Flex>
}