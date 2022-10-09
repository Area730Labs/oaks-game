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
        <MenuButton label="live games" withIcon={false} url='https://oak.bet/live-casino'>
            <></>
        </MenuButton>
        <MenuButton label="slots" withIcon={false} url='https://oak.bet/games?category=Slots'>
            <></>
        </MenuButton>
        <MenuButton label="sports" withIcon={false} url='https://oak.bet/sports'>
            <></>
        </MenuButton>
        <MenuButton label="poker" withIcon={false} url='https://oak.bet/games?category=Video%20Poker'>
            <></>
        </MenuButton>
        <MenuButton label="top 30" withIcon={true} modal="top">
            <TopImg />
        </MenuButton>
        <MenuButton label="faq" withIcon={true} modal="faq">
            <FaqImg />
        </MenuButton>
        <MenuButton label="statistics" withIcon={true} modal="stats">
            <StatsImg />
        </MenuButton>
        <ConnectButton>connect wallet</ConnectButton>
    </Flex>)
}