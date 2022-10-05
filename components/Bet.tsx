import { Box, Flex, Text, Img } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { BetObject } from "../interfaces/Bet";
import Nft from "../interfaces/nft";
import { useApp } from "./AppContext";
import { useStyle } from "./StyleContext";
import { Username } from "./Username";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";





function BetNftImage(props: { item: Nft, key: any}) {
    const [img, setImg] = useState('/icons/holder.jpeg');
    useEffect(() => {
        const getImg = async() => {
            if (!props || !props.item || !props.item.address){
                return;
            }

           try {
            // const connection = new Connection(clusterApiUrl("mainnet-beta"));
            const connection = new Connection('https://snowy-lively-snowflake.solana-mainnet.quiknode.pro/3c545fb3fa56c585512c81b6cf190db3d02df68b/');
            const metaplex = new Metaplex(connection);

            const mintAddress = new PublicKey(props.item.address);
            const nft = await metaplex.nfts().findByMint({ mintAddress }).run();

            const imgUrl = (await (await fetch(nft.uri)).json()).image;
        
            setImg(imgUrl);
           } catch(e) {
            console.error(e);
           }
        };

        getImg();
    }, [props.item.address]);

    return <Box
        width="70px"
        height="70px"
        borderRadius="6px"
        overflow="hidden"
    >
        <Img
            src={img}
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

    
    const betdepositvalue = `${props.item.nfts.length} NFTs (${parseFloat(props.item.value.toFixed(2))}SOL)`
    const chance = useMemo(() => {
        return (Math.floor((props.item.value * 100 / game.game.total_floor_value * 100)) / 100);
    }, [game.game.total_floor_value])

    let avatarStyle = {
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png)',
        backgroundSize: 'contain',
        with: '40px',
        height: '40px'
    }

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
                    flexShrink='0'
                >
                    {/* <Img src={props.item.user.image} /> */}
                    <Box style={avatarStyle}/>
                </Box>
                <Flex
                    direction="column"
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