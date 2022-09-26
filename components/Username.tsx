import { Box } from "@chakra-ui/react";
import { useStyle } from "./StyleContext";

export function Username(props: { children: any, active?: boolean, color?: string }) {

    const { styles } = useStyle();

    return <Box
        fontSize="12px"
        color={styles.username}
        // fontWeight="bold"
    >{props.children}</Box>
}