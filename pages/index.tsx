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
import { ToastContainer, toast } from 'react-toastify';

require('@solana/wallet-adapter-react-ui/styles.css');
import 'react-toastify/dist/ReactToastify.css';
import { WsContextProvider } from '../components/WsContext'

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
    <>
      <ToastContainer position='bottom-right' theme="dark" />
      <ChakraProvider>
        <StyleContextProvider>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
              <WalletModalProvider>
                <WsContextProvider>
                  <AppContextProvider>
                    <MainPage></MainPage>
                  </AppContextProvider>
                </WsContextProvider>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </StyleContextProvider>
      </ChakraProvider>
    </>
  )
}

export default Home
