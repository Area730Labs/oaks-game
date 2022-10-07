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
        <MenuButton label="live games" url='https://oak.bet/live-casino'>
            <></>
        </MenuButton>
        <MenuButton label="slots" url='https://oak.bet/games?category=Slots'>
            <></>
        </MenuButton>
        <MenuButton label="sports" url='https://oak.bet/sports'>
            <></>
        </MenuButton>
        <MenuButton label="poker" url='https://oak.bet/games?category=Video%20Poker'>
            <></>
        </MenuButton>
        <MenuButton label="top 30" >
            <TopImg />
        </MenuButton>
        <MenuButton label="faq" modal="faq">
            <FaqImg />
        </MenuButton>
        <MenuButton label="statistics" >
            <StatsImg />
        </MenuButton>
        <ConnectButton>connect wallet</ConnectButton>
    </Flex>)
}