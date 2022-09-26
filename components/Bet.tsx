import { Box, Flex, Text, Img } from "@chakra-ui/react";
import { useMemo } from "react";
import { BetObject } from "../interfaces/Bet";
import { NftInfo } from "../interfaces/NftInfo";
import { useApp } from "./AppContext";
import { useStyle } from "./StyleContext";
import { Username } from "./Username";

function BetNftImage(props: { item: NftInfo }) {

    return <Box
        width="70px"
        height="70px"
        borderRadius="6px"
        overflow="hidden"
    >
        <Img
            src={props.item.image}
            width="70px"
            height="70px"
        />
    </Box>
}

export function Bet(props: { item: BetObject }) {

    const { styles } = useStyle();
    const { currentWallet, betsTotalSol } = useApp()

    let avatarBorder = "none";
    let currentUser = false;
    if (currentWallet == props.item.user.wallet) {
        avatarBorder = "1px solid " + styles.chatSendBtn
        currentUser = true;
    }

    const betdepositvalue = `${props.item.nfts.length} NFTs (${props.item.solSum}SOL)`
    const chance = useMemo(() => {
        return (Math.floor((props.item.solSum * 100 / betsTotalSol * 100)) / 100);
    }, [betsTotalSol])

    return <Box>
        <Flex
            flexDirection="column"
            gap="15px"
            padding="20px"
        >
            <Flex
                direction="row"
                alignItems="center"
                gap="10px"
                height="40px"
            >{/* user info + bet */}
                <Box
                    width="40px"
                    height="40px"
                    borderRadius="99px"
                    overflow="hidden"
                    border={avatarBorder}
                    boxSizing="border-box"
                >
                    <Img src={props.item.user.image} />
                </Box>
                <Flex
                    direction="column"
                    gap="10px"
                >
                    <Username>{props.item.user.username}</Username>
                    <Flex direction="row" fontSize="10px" gap="5px" fontFamily="GolosUI" fontWeight="400">
                        <Box>Deposited: <Text display="inline" color={styles.betInfoValue} fontWeight="600">{betdepositvalue}</Text></Box>
                        <Box>Chance: <Text display="inline" fontWeight="600" color={styles.betInfoValue}>{chance}%</Text></Box>
                    </Flex>
                </Flex>
            </Flex>
            <Flex
                overflow="auto"
            >
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    gap="6px"
                    flexWrap="nowrap"
                > {/* nfts */}
                    {props.item.nfts.map(nftit => {
                        return <BetNftImage item={nftit} />
                    })}
                </Flex>
            </Flex>
        </Flex >

    </Box >
}