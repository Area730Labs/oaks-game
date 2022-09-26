import { Box } from "@chakra-ui/react";
import { useApp } from "./AppContext";
import { Bet } from "./Bet";

export function BetsHistory() {

    const { bets } = useApp();

    return <Box
        display="flex"
        flexDirection="column"
    >
        <Box
            flexGrow="1"
            display="flex"
            flexDirection="column"
            // height={"100vh"}
            height="calc(100vh - 130px)"
            overflowY="scroll"
        >
            {bets.map(it => {
                return <Bet item={it}></Bet>
            })}
        </Box>
    </Box>
}