import { Box, Button, Flex, List, ButtonGroup, Img, Spacer, Image, keyframes, usePrefersReducedMotion, Text } from '@chakra-ui/react'
import { Chat } from './Chat';
import { ChatContextProvider } from './ChatContext';
import { BetsHistory } from './BetsHistory';
import { Navigation } from './Navigation';
import { useStyle } from './StyleContext'
import UserModal from './modals/UserModal';
import NftSelectorModal from './modals/NftSelectorModal';
import { MainBetsInfo } from './MainBetsInfo';
import { useState } from 'react';


export function MainPage() {
    //@ts-ignore
    const [animation, setAnimation] = useState(null);
    const { styles, toggleTheme } = useStyle()


    const userAvatars = [
        {
            'img': 'https://pbs.twimg.com/profile_images/1569799065474404352/ybiusq2L_400x400.jpg',
            'id': 0
        },
        {
            'img': 'https://pbs.twimg.com/profile_images/1380530524779859970/TfwVAbyX_400x400.jpg',
            'id': 1
        },
        {
            'img': 'https://pbs.twimg.com/profile_images/1215070700026855425/7edvU72D_400x400.jpg',
            'id': 2
        }
    ]

    //@ts-ignore
    const [players, setPlayers] = useState(userAvatars);

    const initialWheelState = {
        timeLeft: '1:00',
        nfts:'0/40',
        solAmount: '0',
        avatars: []
    };

    //@ts-ignore
    const [wheelState, setWheelState] = useState(initialWheelState);

    const sector = 45;



    const prefersReducedMotion = usePrefersReducedMotion();
    


   

    const getAvatarStyle = (index: number) => {
        if (index < players.length) {
            return {
                backgroundImage: `url(${players[index].img})`,
                backgroundSize: 'contain',
                border: '2px solid #00B0FF'
            }
        } 

        return null;
    }; 

    let icons = [];

    for(let i = 0; i < 8; ++i){
        icons.push(<Box key={i} className={`selection-base selection-${i + 1}`} style={getAvatarStyle(i)}></Box>);
    }

    const updateNfts = (current: number, max: number) => {
        setWheelState({
            ...wheelState,
            nfts: `${current}/${max}`
        })
    };

    const updateTimeLeft = (timeLeft: string) => {
        setWheelState({
            ...wheelState,
            timeLeft: timeLeft
        })
    };

    const onRoll = () => {
        setWheelState({
            timeLeft: '-',
            nfts:'40/40',
            solAmount: `${Math.floor(Math.random() * 400)}`,
            avatars: wheelState.avatars
        });

        // get this from server
        const playerWinnerId = Math.floor(Math.random() * userAvatars.length);

        let winnerIndex = 0;
        players.map((x, index) => {
            if (x.id == playerWinnerId) {
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
    
    };

    const onReset = () => {
        setAnimation(null);
        setWheelState(initialWheelState);
    };

    return (<>
        <UserModal />
        <NftSelectorModal/>
        <Box position="relative" backgroundColor={styles.bg}>
            <Button
                position="absolute"
                top="20px"
                left="20px"
                onClick={toggleTheme}
                zIndex="11"
            >Toggle theme</Button>

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
                                    <Text color='#B9D4BC' fontSize='18px' lineHeight='37px' fontWeight='normal'>{wheelState.timeLeft}</Text>
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
                    <Button onClick={onRoll}>Roll</Button>
                    <Button onClick={onReset}>Reset</Button>

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