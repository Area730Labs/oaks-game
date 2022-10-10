import { Box, Flex, Spacer, Text, Image } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "react-toastify";
import { useApp } from "./AppContext";
import { useStyle } from "./StyleContext"
import { UserInfoBlock } from "./UserInfoBlock";

const UserIconSvgComponent = (props) => (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.633 9.058a1.514 1.514 0 0 0-.275 0A3.683 3.683 0 0 1 3.8 5.367c0-2.042 1.65-3.7 3.7-3.7a3.696 3.696 0 0 1 .133 7.392ZM13.675 3.333A2.915 2.915 0 0 1 16.59 6.25a2.92 2.92 0 0 1-2.808 2.917.94.94 0 0 0-.217 0M3.466 12.133c-2.016 1.35-2.016 3.55 0 4.892 2.292 1.533 6.05 1.533 8.342 0 2.017-1.35 2.017-3.55 0-4.892-2.283-1.525-6.042-1.525-8.342 0ZM15.283 16.667a4.03 4.03 0 0 0 1.633-.725c1.3-.975 1.3-2.584 0-3.559-.458-.35-1.016-.583-1.608-.716"
        stroke={props.color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
)

const UsersOnlineComponent = (props) => (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.667 7.5v-.833c0-2.5 1.667-4.167 4.167-4.167h8.333c2.5 0 4.167 1.667 4.167 4.167v6.666c0 2.5-1.667 4.167-4.167 4.167h-.833"
        stroke={props.color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.075 9.758c3.85.492 6.675 3.325 7.175 7.175M2.183 12.558c2.825.359 4.9 2.442 5.267 5.267M1.65 15.717c1.409.183 2.45 1.216 2.634 2.633"
        stroke={props.color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
  

export function MainBetsInfo() {

    const { styles } = useStyle();
    const { setCurrentModal, user, game } = useApp();
    const { connected } = useWallet();
    const {setVisible} = useWalletModal();

    function makeBetHandler() {
        if (!connected) {
            setVisible(true);
            // todo add callback after connection ?
        } else {
            setCurrentModal("betmodal");
        }
    }

    return <>
        <Flex
            gap="30px"
            height="53px"
            marginLeft="20px"
            marginTop="20px"
        >
            {user ? <UserInfoBlock user={user} /> : null}
            <Flex
                cursor="pointer"
                padding={"12px 24px"}
                backgroundColor={styles.chatSendBtn}
                width={"128px"}
                textTransform="uppercase"
                borderRadius={"6px"}
                fontSize="13px"
                lineHeight="17px"
                display="flex"
                gap="10px"

                flex="none"

                flexGrow="0"
                flexDirection="row"
                alignItems="center"

                color={styles.makeBetBtnColor}
                onClick={makeBetHandler}
            >
                Make a bet
            </Flex>
            
            <Spacer/>

            <Flex direction='row' marginRight='-15px' gap='5px'>
                <Box width='20px' height='20px' marginTop='17px'>
                    <UserIconSvgComponent color={styles.iconsColor} />
                </Box>
                <Text lineHeight='53px' fontSize='16px' color={styles.betInfoValue}>{game?.players?.length}</Text>
                <Text lineHeight='53px' fontSize='16px' fontWeight='normal'>Players</Text>
            </Flex>

            <Flex direction='row' marginRight='15px' gap='5px'>
                <Box width='20px' height='20px' marginTop='17px'>
                    <UsersOnlineComponent color={styles.iconsColor}/>
                </Box>
                <Text lineHeight='53px' fontSize='16px' color={styles.betInfoValue}>{game.online}</Text>
                <Text lineHeight='53px' fontSize='16px' fontWeight='normal'>Watching</Text>
            </Flex>
            
        </Flex>
    </>
}