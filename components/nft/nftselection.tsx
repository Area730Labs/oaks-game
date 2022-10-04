import React, { useEffect, useMemo, useState } from "react";
import { Box, GridItem, Text } from "@chakra-ui/layout";
import { CheckIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import Nft from "../../interfaces/nft";
import { useApp } from "../AppContext";
import { useStyle } from "../StyleContext";

export interface NftSelectionProps {
    item: Nft
    borderSize?: number
    onSelect?: { (pubkey: Nft, state: boolean): boolean }
}

export function NftSelection(props: NftSelectionProps | any) {

    const { styles } = useStyle();
    const ctx = useApp();
    const staking = props.staking

    const [selected, setSelected] = useState<boolean>(false);

    const nftInfo = props.item;
    const borderSize = props.borderSize ?? 4;

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
            return `${borderSize}px solid white`
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
            border: `${borderSize}px solid black`
        }}
        backgroundColor={"white"}//appTheme.themeColor}
        onClick={clickHandler}
        {...props}
    >
        {selected ? <Box
            color="black"
            borderRadius="50%"
            border={`${borderSize}px solid black`}
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
            <Box overflowY="hidden" borderRadius={brVal} minH={["100px", "150px", "200px"]} minW={["100px", "150px", "200px"]} backgroundColor={styles.chat}>
                <Image margin="0 auto" maxH={["100px", "150px", "200px"]} maxW={["100px", "150px", "200px"]} src={nftInfo.image} borderRadius={brVal} />
            </Box>
            <Text width="100%" marginTop="2" color="black" marginBottom="2">{nftInfo.name}</Text>
        </Box>
        {props.children}
    </GridItem>
}
