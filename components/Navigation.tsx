import { Flex, Text, Spacer, Box } from "@chakra-ui/react";
import { FaqImg, StatsImg, TopImg, WalletImg } from "./Icons";
import { MenuButton } from "./MenuButton";
import { ConnectButton } from "./override/ConnectButton";
export function Navigation() {

    return (<Flex
        gap="1px"
        alignSelf="flex-end"
        marginRight="20px"
    >
        <Spacer/>
        <MenuButton label="top 30" >
            <TopImg />
        </MenuButton>
        <MenuButton label="faq" >
            <FaqImg />
        </MenuButton>
        <MenuButton label="statistics" >
            <StatsImg />
        </MenuButton>
        <ConnectButton>connect wallet</ConnectButton>
    </Flex>)
}