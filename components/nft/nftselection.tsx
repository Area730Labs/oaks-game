import React, { useEffect, useMemo, useState, useRef } from "react";
import { Box, GridItem, Text } from "@chakra-ui/layout";
import { CheckIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import Nft from "../../interfaces/nft";
import { useApp } from "../AppContext";
import { useStyle } from "../StyleContext";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import throttle from "lodash.throttle";


/**
 * Check if an element is in viewport

 * @param {number} offset - Number of pixels up to the observable element from the top
 * @param {number} throttleMilliseconds - Throttle observable listener, in ms
 */
 export default function useVisibility<Element extends HTMLElement>(
    offset = 0,
    throttleMilliseconds = 100
  ): [Boolean, React.RefObject<Element>] {
    const [isVisible, setIsVisible] = useState(false);
    const currentElement = useRef<Element>();
  
    const onScroll = throttle(() => {
      if (!currentElement.current) {
        setIsVisible(false);
        return;
      }
      const top = currentElement.current.getBoundingClientRect().top;
      setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
    }, throttleMilliseconds);
  
    useEffect(() => {
      document.addEventListener('scroll', onScroll, true);
      return () => document.removeEventListener('scroll', onScroll, true);
    });
  
    return [isVisible, currentElement];
  }
  

export interface NftSelectionProps {
    item: Nft
    borderSize?: number
    onSelect?: { (pubkey: Nft, state: boolean): boolean },
    idx: number
}

export function NftSelection(props: NftSelectionProps | any) {

    const { styles } = useStyle();
    const ctx = useApp();
    const staking = props.staking

    const [selected, setSelected] = useState<boolean>(false);

    const nftInfo = props.item;
    const borderSize = props.borderSize ?? 4;

    const [img, setImg] = useState('/icons/holder.jpeg');
    const [imgName, setImgName] = useState('');
    const { connection, imageCache, setImageCache } = useApp();

    const [ isVisible, currentElement ] = useVisibility<HTMLDivElement>(100);

    useEffect(() => {
        if (!isVisible && props.idx > 20){
            return;
        }

        const getImg = async () => {
            if (!props || !props.item || !props.item.address) {
                return;
            }

            const mint = props.item.address.toString();
            const cachedImgUrl = imageCache[mint];

            // if (cachedImgUrl){
            //     setImg(cachedImgUrl);
            //     return;
            // } 

            try {
                const metaplex = new Metaplex(connection);

                const mintAddress = new PublicKey(props.item.address);
                const nft = await metaplex.nfts().findByMint({ mintAddress }).run();

                const meta = (await (await fetch(nft.uri)).json())
                const imgUrl = meta.image;

                setImgName(meta.name);

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
    }, [props.item, isVisible]);

    function clickHandler() {

        const newState = !selected;

        const shouldSelect = props?.onSelect(props.item, newState);

        if (shouldSelect) {
            if (!selected) {
                setSelected(true);
            } else {
                setSelected(false);
            }
        }

    }

    const border = React.useMemo(() => {
        if (!selected) {
            return `${borderSize}px solid ${styles.chatSendBtn}`
        } else {
            return `${borderSize}px solid ${styles.chatSendBtn}`
        }
    }, [selected]);

    const brVal = styles.borderRadiusPx + "px"

    return <GridItem
        cursor="pointer"
        // ='100%'
        w="100%"
        maxH='280px'
        borderRadius={styles.borderRadiusPx+"px"}
        boxShadow="xl"
        border={border}
        transition="all .2s ease"
        _hover={{
            boxShadow: "dark-lg",
            border: `${borderSize}px solid ${styles.chatSendBtn}`
        }}
        backgroundColor={styles.chat_even}//appTheme.themeColor}
        onClick={clickHandler}
        {...props}
    >
        {selected ? <Box
            color="black"
            borderRadius="50%"
            border={`${borderSize}px solid ${styles.chatSendBtn}`}
            borderColor={styles.chatSendBtn}
            backgroundColor="white"
            display="inline-block"
            position="absolute"
            left="15px"
            top="15px"
            p="2"
            px="3"
        >
            <CheckIcon />
        </Box> : null}

        <Box p="2.5"
            paddingBottom="4"
            overflow="hidden"
            textAlign="left"
        >
            <Box ref={currentElement} overflowY="hidden" borderRadius={brVal} minH={["100px", "150px", "200px"]} minW={["100px", "150px", "200px"]} backgroundColor={styles.chat}>
                <Image  margin="0 auto" maxH={["100px", "150px", "200px"]} maxW={["100px", "150px", "200px"]} src={img} borderRadius={brVal} />
            </Box>
            <Text width="100%" marginTop="2" color={styles.username} marginBottom="2" >{imgName}</Text>
        </Box>
        {props.children}
    </GridItem>
}
