import { toast } from "react-toastify";
import { WalletAdapter } from "@solana/wallet-adapter-base";
import { Box, GridItem } from "@chakra-ui/layout";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Nft from "../../interfaces/nft";
import { AppContextType, useApp } from "../AppContext";
import GlobalConfig from "../../config";
import { useStyle } from "../StyleContext";
import { Button } from "../override/Button";
import NftSelectorGrid from "./selectorgrid";
import { NftSelection } from "./nftselection";
import Fadeable from "../fadeable";
import { roundNumber } from "../../utils";
import { Flex, Spinner, Text } from "@chakra-ui/react";


export interface NftsSelectorProps {
    items: Nft[]

    maxChunk: number
    maxSelectedMsg?: string

    actionLabel: ReactNode
    actionHandler: {
        (
            wallet: WalletAdapter,
            app: AppContextType,
            // solanaConnection: SolanaRpc,
            selectedItems: { [key: string]: boolean }
        ): Promise<any>
    }
}

export default function NftsSelector(props: NftsSelectorProps) {

    const app = useApp();

    const { currentWallet, wallet, api, game } = app;
    const { styles } = useStyle();

    const [selectedItems, setSelectedItems] = React.useState<{ [key: string]: boolean }>({});
    const [selectedItemsCount, setSelectedItemsCount] = React.useState(0);
    const [selectedItemsPopupVisible, setSelectedPopupVisible] = React.useState(false);

    const action_label = props.actionLabel ?? ""
    const max_selection = props.maxChunk;

    const [betValue, setBetValue] = useState(0);
    const [upadtingValue, setUpdating] = useState(false);

    function selectionHandler(item: Nft, state: boolean): boolean {

        if (state && selectedItemsCount == max_selection) {

            toast.warn(props.maxSelectedMsg ?? "max item selected, deselect first")

            return false;
        } else {

            let nsi = selectedItems;

            if (!state) {
                delete nsi[item.address.toBase58()];
                setSelectedItemsCount(selectedItemsCount - 1);
            } else {
                nsi[item.address.toBase58()] = true;
                setSelectedItemsCount(selectedItemsCount + 1);
            }

            setSelectedItems(nsi);

            return true;
        }
    }

    const winChance = useMemo(() => {
        return betValue / (game.game.total_floor_value + betValue) * 0.99;
    }, [betValue, game.game.total_floor_value]);

    function performActionWithSelectedItems() {
        props.actionHandler(wallet.adapter, app, selectedItems).then((signature) => {
            // cleanup selection
            setSelectedItemsCount(0);
            setSelectedItems({});
        })
    }

    React.useEffect(() => {
        if (selectedItemsCount > 0) {
            setSelectedPopupVisible(true)

            setUpdating(true);
            api.calc_bet_map(selectedItems).then((value) => {
                setBetValue(value);
            }).catch(e => {
                console.warn('unable to calc bet value ', e)
            }).finally(() => {
                setUpdating(false);
            })

        } else {
            setSelectedPopupVisible(false);
            setBetValue(0)
        }
    }, [selectedItemsCount]);


    const nftsPlaceholders = [];

    const maxPerRow = GlobalConfig.selector_max_nft_per_row;

    const items = props.items;

    // fill the row with placeholders
    // @todo use nft layout 
    const diffToDraw = maxPerRow - Math.floor(items.length % maxPerRow);

    if (items && diffToDraw != 0) {
        for (var i = 0; i < diffToDraw; i++) {
            nftsPlaceholders.push(<GridItem
                key={i}
                w="100%"
                maxH='280px'
                borderRadius={styles.borderRadiusPx + "px"}
                transition={styles.transition}
                backgroundColor={styles.chat}>
            </GridItem>)
        }
    }

    return <Box >
        <Fadeable
            isVisible={selectedItemsPopupVisible}
            fadesize={7}

            left="0"
            right="0"

            margin="0 auto"
            position="fixed"
            top="20px"

            width={["100%", "350px", "500px"]}
            zIndex="20"
            backgroundColor="whiteAlpha.900"
            alignSelf="stretch"
            color="black"
            p="4"
            borderRadius={styles.borderRadiusPx + "px"}
            justifyItems="center"
            textAlign="center"
        >
            <Flex alignItems="center" gap="10px">
                <Box fontSize="32px" fontWeight="bold">
                    {upadtingValue ? <Spinner /> :
                        (roundNumber(winChance * 100, 3))}%
                </Box>
                <Flex direction="column" fontSize="12px" textAlign="left" flexGrow="1">
                    <Text>
                        Win
                    </Text>
                    <Text>
                        chance
                    </Text>
                </Flex>
                <Button
                    display="flex"
                    justifySelf="flex-end"
                    onClick={performActionWithSelectedItems}>
                    {action_label}
                    <Box
                        display="inline"
                        right="-15px"
                        top="-15px"
                        marginLeft="10px"
                        p="1"
                        px="2.5"
                        borderRadius={"99px"}
                        backgroundColor={styles.chat_even}
                    > {selectedItemsCount} NFT / {upadtingValue ? <Spinner /> : roundNumber(betValue, 2)} SOL
                    </Box>
                </Button>
            </Flex>

        </Fadeable>
        <NftSelectorGrid>
            {items && items.map((it, idx) => {
                return <NftSelection
                    key={idx}
                    item={it}
                    position="relative"
                    onSelect={selectionHandler}
                >
                </NftSelection>
            })}
            {nftsPlaceholders.map((it, idx) => {
                return it;
            })}
        </NftSelectorGrid>
    </Box>
}