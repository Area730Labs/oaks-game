
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import { ReactNode } from "react"
import { StyledButton, useStyle } from "../StyleContext"


export type ButtonType = 'success' | 'info'

export interface ButtonProps extends ChakraButtonProps {
    children: ReactNode,
    variant? : ButtonType
}

export function Button(props: ButtonProps) {

    const { styles } = useStyle()

    const { children, variant, ...rest } = props;


    const variantOrDefault = variant || 'success'

    let variantStyle : StyledButton = styles.buttons[variantOrDefault]

    return <ChakraButton
        bgColor={variantStyle.bg}
        color={variantStyle.color}
        _hover={{ bgColor: variantStyle.bg, color: variantStyle.color }}
        mr={3}
        {...rest}
    >
        {children}
    </ChakraButton>


}