import { Text } from '@chakra-ui/react'

export function TopImg() {
    return <Text className="icon-people"></Text>
}

export function FaqImg() {
    return <Text className="icon-message-question"></Text>
}

export function StatsImg() {
    return <Text className="icon-note"></Text>
}

export function WalletImg() {
    return <Text className="icon-empty-wallet"></Text>
}

export function SendImg(props: any) {
    return <Text className="icon-send" {...props}></Text>
}