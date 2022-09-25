import { Box, GridItem, Grid, Button } from '@chakra-ui/react'
import {useEffect} from 'react'
import { useStyle } from './StyleContext'

export function MainPage() {

    const { styles, toggleTheme } = useStyle()

    const toggleHandler = () => {
        alert("toggle handler")
        toggleTheme();
    }
    useEffect(() => {
        console.log('style props',styles.header)
    },[styles]);

    return (<Box position="relative">
        <Button position="absolute" top="20px" right="20px" onClick={toggleHandler}>Toggle theme</Button>
        <Grid
            templateAreas={`
          "header header header"
          "chat main history"
          "footer footer footer"
          `}
            gap='1'
            color='blackAlpha.700'
            fontWeight='bold'
        >
            <GridItem bg={styles.header} height="70px" area={'header'}>
            </GridItem>
            <GridItem bg='pink.300' area={'chat'}>
                chat
            </GridItem>
            <GridItem bg='green.300' area={'main'}>
                Main
            </GridItem>
            <GridItem bg='blue.300' area={'history'}>
                history
            </GridItem>
            <GridItem bg='blue.300' area={'footer'}>
                footer
            </GridItem>
        </Grid>
    </Box >)
}