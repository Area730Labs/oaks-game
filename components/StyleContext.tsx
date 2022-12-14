import React, { useEffect } from "react";

export type ThemeType = "white" | "black";

export interface StyledButton {
    bg : string
    color: string
}

export interface StyledButtons {
    info : StyledButton
    success: StyledButton
}

export interface StylesType {
    bg : string,
    header: string
    chat : string
    chat_even : string
    chat_label: string
    color: string
    username : string
    meUsername: string
    shadowRight: string
    shadowLeft: string
    chatInput : string
    shadowTop: string
    chatSendBtn: string
    chatInputBg: string
    menuColor: string
    menuIcon: string
    menuIconHover: string
    betInfoValue: string
    makeBetBtnColor: string
    buttons: StyledButtons 
    borderRadiusPx: number
    transition: string
}

export interface StyleContextType {
    styles: StylesType,
    theme: ThemeType,
    toggleTheme(): void,
}

const whiteTheme: StylesType = {
    color : "#454F63",
    bg : "rgba(184, 195, 219, 1)",
    header: "rgb(88, 153, 227)",
    chat : "rgba(195, 207, 231, 1)",
    chat_even: "rgba(214, 224, 244, 1)",
    chat_label: "rgba(23, 101, 136, 1)",
    username: "#176588",
    shadowRight: "5px 0px 15px rgba(0, 0, 0, 0.15)",
    shadowLeft : "-5px 0px 15px rgba(0, 0, 0, 0.15)",
    chatInput : "#DAEEF8",
    shadowTop: "0px -5px 20px rgba(0, 0, 0, 0.4)",
    chatSendBtn: "rgba(14, 165, 233, 1)",
    chatInputBg : "rgba(214, 224, 244, 1)",
    menuColor : "#E5F7FF",
    menuIcon: "#386496",
    menuIconHover: "#386496",
    betInfoValue: "#641E8F",
    makeBetBtnColor: "#E5F7FF",
    meUsername : "#1D1D1F",
    buttons: {
        info: {
            bg: "#E5F7FF",
            color: "#343D34"
        }, 
        success: {
            bg: "#0EA5E9",
            color: "#E5F7FF"
        }
    },
    borderRadiusPx: 8,
    transition: "all .2s ease"
}

const blackTheme: StylesType = {
    color : "#CCD7FF",
    bg : "rgba(22, 6, 34, 1)",
    header: "rgb(46, 15, 64)",
    chat : "rgba(56, 44, 89, 1)",
    chat_even : "rgba(62, 50, 98, 1)",
    chat_label : "rgba(180, 75, 255, 1)",
    username: "#B44BFF",
    shadowRight: "5px 0px 15px rgba(0, 0, 0, 0.15)",
    shadowLeft : "-5px 0px 15px rgba(0, 0, 0, 0.15)",
    chatInput : "#2E0F40",
    shadowTop: "0px -5px 20px rgba(0, 0, 0, 0.4)",
    chatSendBtn: "rgba(202, 19, 149, 1)",
    chatInputBg : "rgba(66, 27, 89, 1)",
    menuColor : "#CCCCFF",
    menuIcon: "#CA1395",
    menuIconHover : "#386496",
    betInfoValue: "#B44BFF",
    makeBetBtnColor: "#E5F7FF",
    meUsername : "white",
    buttons: {
        info: {
            bg: "#E5F7FF",
            color: "#343D34"
        }, 
        success: {
            bg: "rgba(202, 19, 149, 1)",
            color: "rgb(229 247 255)"
        }
    },
    borderRadiusPx : 8,
    transition: "all .2s ease"
}

const current_theme_storage_key = "current_theme";
export const defaultTheme = "white";

const StyleContext = React.createContext<StyleContextType>({} as StyleContextType);

function readThemeValue(): ThemeType {
    const themeValue = localStorage.getItem(current_theme_storage_key)
    if (themeValue == null || themeValue == "") {
        return defaultTheme;
    } else {
        return themeValue as ThemeType;
    }
}

export function StyleContextProvider(props: { children: any }) {

    const [theme, setTheme] = React.useState<ThemeType | null>(null);

    useEffect(() => {
        setTheme(readThemeValue())
    }, [])

    function toggleThemeHandler() {

        let curTheme = readThemeValue();

        if (curTheme == "black") {
            curTheme = "white"
        } else {
            curTheme = "black";
        }

        localStorage.setItem(current_theme_storage_key, curTheme)

        setTheme(curTheme);
    }

    const memoed: StyleContextType = React.useMemo(function () {

        if (theme != null) {
            let themeStyle = {} as StylesType;

            if (theme === "white") {
                themeStyle = whiteTheme
            } else {
                themeStyle = blackTheme
            }

            const item: StyleContextType = {
                toggleTheme: toggleThemeHandler,
                styles: themeStyle,
                theme: theme
            };

            return item;
        } else {
            return {} as StyleContextType;
        }
    }, [theme, toggleThemeHandler]);

    if (theme != null) {
        return <StyleContext.Provider value={memoed}>
            {props.children}
        </StyleContext.Provider>
    } else {
        return null;
    }
}


export function useStyle(): StyleContextType {

    const ctx = React.useContext(StyleContext);

    if (ctx != null) {
        return ctx;
    } else {
        throw new Error("style context is not wrapped");
    }
}