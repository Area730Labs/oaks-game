import type { NextPage } from 'next'
import { Box, GridItem, Grid } from '@chakra-ui/react'
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { StyleContextProvider } from '../components/StyleContext'

const Home: NextPage = () => {

  return (
    <ChakraProvider>
      <StyleContextProvider>
        <Box>
          <Grid
            templateAreas={`
                "header header header"
                "chat main history"
                "footer footer footer"
                `}
            // gridTemplateColumns={'150px 1fr'}
            h='200px'
            gap='1'
            color='blackAlpha.700'
            fontWeight='bold'
          >
            <GridItem bg='orange.300' height="70px" area={'header'}>
              Header s
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
        </Box >
      </StyleContextProvider>
    </ChakraProvider>
  )
}

export default Home
