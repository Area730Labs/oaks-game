import { GridItem } from "@chakra-ui/layout";
import { StyleProps } from "@chakra-ui/react";
import GlobalConfig from "../../config";
import { useStyle } from "../StyleContext";
import NftSelectorGrid from "./selectorgrid";

import { Image, keyframes, usePrefersReducedMotion } from '@chakra-ui/react'
// const spin = keyframes`
//     100% {
//       transform: translateX(100%);
//     }
// `

export interface EmptyRowProps extends StyleProps {
    skeleton?: boolean
}

export default function EmptyRow(props: EmptyRowProps) {

    const maxPerRow = GlobalConfig.selector_max_nft_per_row;
    const nftsPlaceholders = [];

    const { styles } = useStyle();

    // const animation = (props.skeleton ?? false) ? `${spin} infinite 2s linear` : undefined;

    // @todo use nft layout 
    for (var i = 0; i < maxPerRow; i++) {
        nftsPlaceholders.push(<GridItem
            // _before={{
            //     top: 0,
            //     bottom: 0,
            //     right: 0,
            //     left: 0,
            //     transform: "translateX(-100%)",
            //     backgrounImage: `linear-gradient(
            //     90deg,
            //     rgba(#fff, 0) 0,
            //     rgba(#fff, 0.2) 20%,
            //     rgba(#fff, 0.5) 60%,
            //     rgba(#fff, 0)
            //   )`, animation: animation
            // }}
            key={i}
            cursor="pointer"
            w="100%"
            maxH='280px'
            minH='230px'
            borderRadius={styles.borderRadiusPx + "px"}
            transition={styles.transition}
            backgroundColor={styles.chat}></GridItem>)
    }

    return <NftSelectorGrid {...props}>{nftsPlaceholders}</NftSelectorGrid>

}