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
import { PublicKey } from '@solana/web3.js';
import WinnerDialog from './modals/WinnerDialog';


export function MainPage() {
    //@ts-ignore
    const [animation, setAnimation] = useState(null);
    const { styles, toggleTheme } = useStyle()
    const {game: {players, game, bets}, currentWallet} = useApp();
    const { currentModal, api, setCurrentModal } = useApp();
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [winnerAnimOverTime, setWinnerAnimOverTime] = useState(0);

    const [fakeState, setFakeState] = useState(0);
    const [lastState, setLastState] = useState(0);

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

    useEffect(() => {
        setTimeout(() => {
            setFakeState(1);
        }, 2000);

        setTimeout(() => {
            setFakeState(2);
        }, 5000);

        setTimeout(() => {
            setFakeState(3);
        }, 10000);

        setTimeout(() => {
            setFakeState(4);
        }, 12000);
    }, []);


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
        }
    }, [game]);

    for(let i = 0; i < 8; ++i){
        icons.push(<Box key={i} className={`selection-base selection-${i + 1}`} style={getAvatarStyle(i)}></Box>);
    }

    // timer
    useEffect(() => {
        if (!game) return;

        const gState = game.state; //fakeState


        if (game.started_at == 0 || gState > 0) {
            pause();
        }

        if (game.started_at > 0) {
            let dueTime = new Date(game.started_at*1000 + game.duration_min*60*1000);
    
            restart(dueTime);
        }

        if (gState == 0 && gState != lastState) {
            setLastState(gState);
        }

        if (gState == 2 && gState != lastState) {
            const spin = keyframes`
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }`

            const anim = prefersReducedMotion
            ? undefined
            : `${spin} infinite 1s linear normal forwards`;

            setAnimation(anim);

            setLastState(gState);
        }

        if (gState == 4 && gState != lastState) {
            const finalAngle = 180 + 1800 - 3 * sector;

            const spin = keyframes`
            from { transform: rotate(0deg); }
            to { transform: rotate(${finalAngle}deg); }`

            const anim = prefersReducedMotion
            ? undefined
            : `${spin} 1 5s ease-out normal forwards`;

            setAnimation(anim);

            setWinnerAnimOverTime(Date.now() + 5000);


            setLastState(gState);
        }

        // prize sent
        if (gState == 5 && gState != lastState) {
            const winnerId = game.winner;
            alert("winner: " + winnerId + ", your wallet: " + currentWallet);

            let youWon = winnerId && (new PublicKey(winnerId)) == currentWallet;
           
            if (winnerAnimOverTime < Date.now()) {
                setAnimation(null);

                if (youWon) {
                    setCurrentModal("winnerdialog");
                    // alert('Your prize should be already in your wallet!');
                }
               
            } else {
                setTimeout(() => {
                    setAnimation(null);

                    if (youWon) {
                        alert('Your prize should be already in your wallet!');
                    }
                }, winnerAnimOverTime - Date.now() + 5000);
            }
            
            setLastState(gState);

        }
    }, [game, fakeState]);


    let participants = [];
    bets.map((bet) => {
        const chance = (Math.floor((bet.value * 100 / game.total_floor_value * 100)) / 100);
        const user = bet.user.username;

        participants.push((
            <Flex gap='6px'>
                <Text fontWeight='normal' fontSize='11px'>{user}</Text>
                <Text fontWeight='normal' fontSize='11px' color='#641E8F'>{chance}%</Text>
            </Flex>
        ))
    });

    return (<>
        <UserModal />
        <WinnerDialog />
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
                    width="290px"
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
                    
                    <MainBetsInfo/>

                    <Flex flexDir='row' marginLeft='20px' marginTop='10px'>
                        {participants}
                    </Flex>
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