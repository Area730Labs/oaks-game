import { Flex } from "@chakra-ui/react";
import { FaqImg, StatsImg, TopImg, WalletImg } from "./Icons";
import { MenuButton } from "./MenuButton";

export function Navigation() {
    return (<Flex
        gap="1px"
        alignSelf="flex-end"
        marginRight="20px"
    >
        <MenuButton label="top 30" >
            <TopImg />
        </MenuButton>
        <MenuButton label="faq" >
            <FaqImg />
        </MenuButton>
        <MenuButton label="statistics" >
            <StatsImg />
        </MenuButton>
        <MenuButton
            marginLeft="30px"
            label="connect wallet"
        >
            <WalletImg />
        </MenuButton>
    </Flex>)
}