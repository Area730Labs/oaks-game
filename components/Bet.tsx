import { Box, Flex, Text, Img, Spinner, Image } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { BetObject } from "../interfaces/Bet";
import Nft from "../interfaces/nft";
import { useApp } from "./AppContext";
import { useStyle } from "./StyleContext";
import { Username } from "./Username";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { ReactNode } from "react";

export function BetNftImage(props: { item: Nft, key: any }) {
    const [img, setImg] = useState('/icons/holder.jpeg');

    const { connection, imageCache, setImageCache } = useApp();

    useEffect(() => {
        const getImg = async () => {
            if (!props || !props.item || !props.item.address) {
                return;
            }

            const mint = props.item.address.toString();
            const cachedImgUrl = imageCache[mint];

            if (cachedImgUrl){
                setImg(cachedImgUrl);
                return;
            } 

            try {
                const metaplex = new Metaplex(connection);

                const mintAddress = new PublicKey(props.item.address);
                const nft = await metaplex.nfts().findByMint({ mintAddress }).run();

                const imgUrl = (await (await fetch(nft.uri)).json()).image;

                if (imgUrl) {
                    setImg(imgUrl);

                    let newCache = {
                        ...imageCache
                    };
                    newCache[mint] = imgUrl;
                    setImageCache(newCache);
                }

            } catch (e) {
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

export function NftImage(props: { mint: string, key: any, onClick: any }) {
    const [img, setImg] = useState('/icons/holder.jpeg');

    const { connection, imageCache, setImageCache } = useApp();

    useEffect(() => {
        const getImg = async () => {
            const cachedImgUrl = imageCache[props.mint];

            if (cachedImgUrl){
                setImg(cachedImgUrl);
                return;
            } 

            try {
                const metaplex = new Metaplex(connection);

                const mintAddress = new PublicKey(props.mint);
                const nft = await metaplex.nfts().findByMint({ mintAddress }).run();

                const imgUrl = (await (await fetch(nft.uri)).json()).image;

                if (imgUrl) {
                    setImg(imgUrl);

                    let newCache = {
                        ...imageCache
                    };
                    newCache[props.mint] = imgUrl;
                    setImageCache(newCache);
                }

            } catch (e) {
                console.error(e);
            }
        };

        getImg();
    }, [props.mint]);

    const selectImage = async() => {
        if (img != '/icons/holder.jpeg') {
            props.onClick(img);
        }
    };

    return <Image src={img} borderRadius='10px' cursor='pointer' onClick={selectImage} />
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

    const betdepositvalue = `${props.item.nfts.length} NFTs (${props.item.value.toFixed(2)}SOL)`
    const chance = useMemo(() => {
        return (Math.floor((props.item.value * 100 / game.game.total_floor_value * 100)) / 100);
    }, [game.game.total_floor_value])

    let imgUrl = 'url(/icons/avatar.png)';

    if (props.item.user.image) {
        imgUrl = `url(${props.item.user.image})`;
    }

    let avatarStyle = {
        backgroundImage: imgUrl,
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
            {!props.item.confirmed ? (<Flex fontSize={"10px"} alignContent="center">
                <Spinner /> <Text marginLeft="10px"> Waiting confiramtion</Text>
            </Flex>) : null}
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
                    <Box style={avatarStyle} />
                </Box>
                <Flex
                    direction="column"
                >
                    <Username>{props.item.user.username}</Username>
                    <Flex direction="row" fontSize="10px" gap="5px" fontFamily="GolosUI" fontWeight="400" >
                        <Box>Deposited: <Text display="inline" color={styles.betInfoValue} fontWeight="600">{betdepositvalue}</Text></Box>
                        
                        {props.item.confirmed && <Box>Chance: <Text display="inline" fontWeight="600" color={styles.betInfoValue}>{chance}%</Text></Box>}
                        
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