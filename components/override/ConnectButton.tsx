import { useWallet } from '@solana/wallet-adapter-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ChakraProps } from '@chakra-ui/react';
import { WalletImg } from '../Icons';
import { MenuButton } from '../MenuButton';

export interface MultiButtonProps extends ChakraProps {
    children: string
}

export interface WalletButtonImageProps extends ChakraProps {
    children: string
    onClick?(e: Event): any
}

const WalletButtonImage = (props: WalletButtonImageProps) => {

    let { children, ...rest } = props;

    return <MenuButton
        marginLeft="30px"
        label={children}
        {...rest}
    >
        <WalletImg />
    </MenuButton>
}


export const WalletModalButtonOverride = ({ children = 'SELECT WALLET', onClick, ...props }) => {
    const { visible, setVisible } = useWalletModal();

    const handleClick = useCallback(
        (event: any) => {
            console.log("connect wallet click handling")

            if (onClick) {
                console.log('there is onClick binded')
                onClick(event);
            }
            if (!event.defaultPrevented) {
                console.log('default is not prevented')
                setVisible(!visible);
            }
        },
        [onClick, setVisible, visible]
    );

    return <WalletButtonImage onClick={handleClick}>{children}</WalletButtonImage>;
};

const WalletConnectButtonOverride = ({ children, onClick, ...props }) => {
    const { wallet, connect, connecting, connected } = useWallet();

    const handleClick: any = useCallback(
        (event: Event) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) connect().catch(() => { });
        },
        [onClick, connect]
    );

    const content = useMemo(() => {
        if (children) return children;
        if (connecting) return 'CONNECTING ...';
        if (connected) return 'CONNECTED';
        if (wallet) return 'CONNECT';
        return 'CONNECT WALLET';
    }, [children, connecting, connected, wallet]);

    return (
        <WalletButtonImage
            onClick={handleClick}
            {...props}
        >
            {content}
        </WalletButtonImage>
    );
};


export const ConnectButton = (props: MultiButtonProps) => {

    let { children, ...rest } = props;

    const { publicKey, wallet, disconnect, connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const ref = useRef<HTMLUListElement>(null);

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [children, wallet, base58]);

    const copyAddress = useCallback(async () => {
        if (base58) {
            await navigator.clipboard.writeText(base58);
            setCopied(true);
            setTimeout(() => setCopied(false), 400);
        }
    }, [base58]);

    const openDropdown = useCallback(() => {
        setActive(true);
    }, []);

    const closeDropdown = useCallback(() => {
        setActive(false);
    }, []);

    const openModal = useCallback(() => {

        console.log('inside open modal callback')

        setVisible(true);
        closeDropdown();
    }, [setVisible, closeDropdown]);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            closeDropdown();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, closeDropdown]);


    const connectHandler = () => {
        if (connected) {
            disconnect();
        } else {
            openModal()
        }
    }

    if (!wallet) return <WalletModalButtonOverride onClick={null}>{children}</WalletModalButtonOverride>;
    if (!base58) return <WalletConnectButtonOverride onClick={null}>{children}</WalletConnectButtonOverride>;

    let btnLabel = connected ? "DISCONNECT" : "CONNECT WALLET";

    return <WalletButtonImage onClick={connectHandler}>{btnLabel}</WalletButtonImage>

};