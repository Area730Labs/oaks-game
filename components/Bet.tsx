import { Box, Flex, Text, Img } from "@chakra-ui/react";
import { useMemo } from "react";
import { BetObject } from "../interfaces/Bet";
import Nft from "../interfaces/nft";
import { useApp } from "./AppContext";
import { useStyle } from "./StyleContext";
import { Username } from "./Username";


function BetNftImage(props: { item: NftInfo, key: any}) {
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

export function Bet(props: { item: BetObject, key: any }) {

    const { styles } = useStyle();
    const { currentWallet, game } = useApp()

    let avatarBorder = "none";
    let currentUser = false;
    if (currentWallet?.toBase58() == props.item.user.wallet) {
        avatarBorder = "1px solid " + styles.chatSendBtn
        currentUser = true;
    }

    const betdepositvalue = `${props.item.nfts.length} NFTs (${props.item.value}SOL)`
    const chance = useMemo(() => {
        return (Math.floor((props.item.value * 100 / game.game.total_floor_value * 100)) / 100);
    }, [game.game.total_floor_value])

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
                    <Flex direction="row" fontSize="10px" gap="5px" fontFamily="GolosUI" fontWeight="400" >
                        <Box>Deposited: <Text display="inline" color={styles.betInfoValue} fontWeight="600">{betdepositvalue}</Text></Box>
                        <Box>Chance: <Text display="inline" fontWeight="600" color={styles.betInfoValue}>{chance}%</Text></Box>
                    </Flex>
                </Flex>
            </Flex>
            <Flex
                overflow="auto"
                sx={{
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
            >
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    gap="6px"
                    flexWrap="nowrap"
                    
                > {/* nfts */}
                    {props.item.nfts.map((nftit, index) => {
                        return <BetNftImage key={index} item={nftit} />
                    })}
                </Flex>
            </Flex>
        </Flex >

    </Box >
}