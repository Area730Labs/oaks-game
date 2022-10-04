import { Box } from "@chakra-ui/react";
import { useApp } from "./AppContext";
import { Bet } from "./Bet";
import { useStyle } from "./StyleContext";

export function BetsHistory() {

    const { game } = useApp();
    const { styles } = useStyle();

    return <Box
        display="flex"
        flexDirection="column"
    >
        <Box
            flexGrow="1"
            display="flex"
            flexDirection="column"
            overflowY="scroll"
        >
            {game.bets.map(it => {
                return <Bet item={it}></Bet>
            })}
        </Box>
    </Box>
}