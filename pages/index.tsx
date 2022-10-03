import type { NextPage } from 'next'

import React, { useMemo } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { StyleContextProvider } from '../components/StyleContext'
import { MainPage } from '../components/MainPage'
import { AppContextProvider } from '../components/AppContext'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'


require('@solana/wallet-adapter-react-ui/styles.css');
const Home: NextPage = () => {

  const network = 'mainnet-beta';
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ]
  }, []);

  return (
    <ChakraProvider>
      <StyleContextProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets}>
            <WalletModalProvider>
              <AppContextProvider>
                <MainPage></MainPage>
              </AppContextProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </StyleContextProvider>
    </ChakraProvider>
  )
}

export default Home
