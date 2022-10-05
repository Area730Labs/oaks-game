import { Box, Button, Flex, List, ButtonGroup, Img, Spacer, Image, keyframes, usePrefersReducedMotion, Text } from '@chakra-ui/react'
import { Chat } from './Chat';
import { ChatContextProvider } from './ChatContext';
import { BetsHistory } from './BetsHistory';
import { Navigation } from './Navigation';
import { useStyle } from './StyleContext'
import UserModal from './modals/UserModal';
import NftSelectorModal from './modals/NftSelectorModal';
import { MainBetsInfo } from './MainBetsInfo';
import { useEffect, useState } from 'react';
import { useApp } from './AppContext';
import { useReducer } from 'react';
import { useTimer } from 'react-timer-hook';


export function MainPage() {
    //@ts-ignore
    const [animation, setAnimation] = useState(null);
    const { styles, toggleTheme } = useStyle()
    const {game: {players, game}} = useApp();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const initialWheelState = {
        nfts:'0/40',
        solAmount: '0',
        avatars: []
    };

    const expiryTimestamp  = (new Date());
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600);

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
      } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => console.warn('onExpire called') });
    

    //@ts-ignore
    const [wheelState, setWheelState] = useState(initialWheelState);

    const sector = 45;

    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        forceUpdate();

        // start();
    }, [players]);


    const getAvatarStyle = (index: number) => {
        if (!players){
            return null;
        }

        if (index < players.length) {
            return {
                // backgroundImage: `url(${players[index].img})`,
                backgroundImage: 'url(/icons/avatar.png)',
                backgroundSize: 'contain',
                border: '2px solid #00B0FF'
            }
        } 

        return null;
    }; 

    let icons = [];

    useEffect(() => {
        if (!players){
            return;
        }

        let total = 0;
        let nftCount = 0;

        players.forEach((player) => {
            total += player.total_value;
            nftCount += player.nfts;
        });

        setWheelState({
            ...wheelState,
            nfts: `${nftCount}/${game.max_nfts}`,
            solAmount: parseFloat(total.toFixed(2)).toString()
        })
    }, [players, game]);


    useEffect(() => {
        if (!game) {
            setAnimation(null);
            return;
        }

        if ((game.winner?.trim()?.length || 0) > 0) {
            let winnerIndex = 0;
            players.map((x, index) => {
                if (x.pubkey == game.winner) {
                    winnerIndex = index;
                }
            });

            const finalAngle = 180 + 1800 - winnerIndex * sector;

            const spin = keyframes`
            from { transform: rotate(0deg); }
            to { transform: rotate(${finalAngle}deg); }`

            const anim = prefersReducedMotion
            ? undefined
            : `${spin} 1 5s ease-in-out normal forwards`;

            setAnimation(anim);
        } else {
            setAnimation(null);
        }
    }, [game]);

    for(let i = 0; i < 8; ++i){
        icons.push(<Box key={i} className={`selection-base selection-${i + 1}`} style={getAvatarStyle(i)}></Box>);
    }

    // timer
    useEffect(() => {
        if (game.started_at == 0 || game.state > 0) {
            stop();
            return;
        }

        let dueTime = new Date();
        dueTime.setSeconds(game.started_at);

        restart(dueTime);
    }, [game]);


    return (<>
        <UserModal />
        <NftSelectorModal/>
        <Box position="relative" backgroundColor={styles.bg}>
            <Box
            position="absolute"
            top="8px"
                left="20px"
                display='flex'
            >
                    <Image src='/icons/logo.png' />
                    <Text lineHeight='54px' marginLeft='10px' fontSize='20px' color='white' fontWeight='bold'>PARADISE GAMING</Text>
            </Box>
            

            <Flex
                zIndex="10"
                bg={styles.header}
                style={{ boxShadow: "0px -5px 30px rgba(0, 0, 0, 0.5)" }}
                height="70px"
                flexDirection="column"
                justifyContent="center"
            >
                <Navigation />
            </Flex>
            <Box
                zIndex="5"
                color={styles.color}
                fontWeight='bold'
                display="flex"
            >
                <Box
                    alignSelf="flex-end"
                    bg={styles.chat}
                    width="226px"
                    boxShadow={styles.shadowRight}
                >
                    <ChatContextProvider>
                        <Chat />
                    </ChatContextProvider>
                </Box>
                <Flex
                    flexGrow="1"
                    flexDirection='column'
                >
                    <MainBetsInfo></MainBetsInfo>
                    <Spacer/>

                    <Flex flex='1' justifyContent='center' flexGrow='1'>
                        <Box width='560px' height='560px' backgroundColor='rgba(30, 60, 73, 0.4);' borderRadius='280px' overflow='hidden'>
                            <Box className='wheel-inner'>
                                <Box className='wheel-inner-2' animation={animation}> 
                                    <Image src='/icons/subtract.png' className='wheel-img'></Image>

                                    {icons}
                                </Box>
                            </Box>

                        <Box className='wheel-arrow'></Box>
                        <Box className='wheel-data' textAlign='center'>
                            <Flex flexDirection='column' flex='1' justifyContent='center' alignItems='center' flexGrow='1'>
                                <Text textAlign='center' fontSize='14px' fontFamily='GolosUi' fontWeight='normal' color='black'>Time</Text>
                                <Box className='wheel-text-box'>
                                    <Text color='#B9D4BC' fontSize='18px' lineHeight='37px' fontWeight='normal'>
                                        {isRunning && (
                                            `${minutes}:${seconds}`
                                        )}

                                        {!isRunning && ("-:-")}
                                    </Text>
                                </Box>

                                <Text textAlign='center' fontSize='41px' fontFamily='GolosUi' fontWeight='normal' color='#33B5EF' marginTop='20px'>
                                    {wheelState.solAmount} $SOL
                                </Text>

                                <Text textAlign='center' fontSize='14px' fontFamily='GolosUi' fontWeight='normal' marginTop='10px' color='black'>Current pot</Text>
                                <Box className='wheel-text-box'>
                                    <Text color='#B9D4BC' fontSize='18px' lineHeight='37px' fontWeight='normal'>{wheelState.nfts}</Text>
                                </Box>
                                <Text textAlign='center' fontSize='14px' fontFamily='GolosUi' fontWeight='normal' color='black'>NFTs</Text>

                            </Flex>
                        </Box>
                        </Box>

                    </Flex>
                    <Spacer/>
                   

                </Flex>
                <Box
                    bg={styles.chat_even}
                    width="300px"
                    boxShadow={styles.shadowLeft}
                >
                    <BetsHistory />
                </Box>
            </Box>
        </Box >
    </>)
}