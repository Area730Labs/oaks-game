import { GridItem } from "@chakra-ui/layout";
import GlobalConfig from "../../config";
import { useStyle } from "../StyleContext";
import NftSelectorGrid from "./selectorgrid";

export default function EmptyRow() {

    const maxPerRow = GlobalConfig.selector_max_nft_per_row;
    const nftsPlaceholders = [];

    const {styles} = useStyle();

    // @todo use nft layout 
    for (var i = 0; i < maxPerRow; i++) {
        nftsPlaceholders.push(<GridItem
            key={i}
            cursor="pointer"
            w="100%"
            maxH='280px'
            minH='230px'
            borderRadius={styles.borderRadiusPx+"px"}
            transition={styles.transition}
            backgroundColor={"whiteAlpha.100"}></GridItem>)
    }

    return <NftSelectorGrid>{nftsPlaceholders}</NftSelectorGrid>

}