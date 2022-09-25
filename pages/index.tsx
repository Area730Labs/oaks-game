import type { NextPage } from 'next'

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { StyleContextProvider } from '../components/StyleContext'
import { MainPage } from '../components/MainPage'

const Home: NextPage = () => {

  return (
    <ChakraProvider>
      <StyleContextProvider>
        <MainPage></MainPage>
      </StyleContextProvider>
    </ChakraProvider>
  )
}

export default Home
