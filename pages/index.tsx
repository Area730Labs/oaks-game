import type { NextPage } from 'next'

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { StyleContextProvider } from '../components/StyleContext'
import { MainPage } from '../components/MainPage'
import { AppContextProvider } from '../components/AppContext'

const Home: NextPage = () => {

  return (
    <ChakraProvider>
      <StyleContextProvider>
        <AppContextProvider>
          <MainPage></MainPage>
        </AppContextProvider>
      </StyleContextProvider>
    </ChakraProvider>
  )
}

export default Home
