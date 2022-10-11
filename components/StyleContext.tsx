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
    transition: string,
    chatInputOutline: string,
    navColorWithIcons: string,
    logoLeft: string,
    logoRight: string,
    wheelBg1: string,
    wheelOutline: string,
    wheelBg2: string,
    wheelText: string,
    wheelLabels: string,
    wheelLabelsBg: string,
    wheelTotalLabel: string,
    wheelAvatarBorder: string,
    iconsColor: string,
    lostDialogBg: string,
    losgDialogBorder: string,
    lostDialogColor: string,
    lostDialogSubColor: string,
    winDialogColor: string
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
    transition: "all .2s ease",
    chatInputOutline: "#0EA5E9",
    navColorWithIcons: "#E5F7FF",
    logoLeft: "#2E3339",
    logoRight: "#FFFFFF",
    wheelBg1: "rgba(30, 60, 73, 0.4)",
    wheelOutline: "4px solid #0EA5E9",
    wheelBg2: "rgba(30, 60, 73, 0.3)",
    wheelText: "rgba(33, 37, 53, 1)",
    wheelLabels: "rgba(185, 212, 188, 1)",
    wheelLabelsBg: "rgba(64, 81, 95, 1)",
    wheelTotalLabel: "#33B5EF",
    wheelAvatarBorder: "2px solid #00B0FF",
    iconsColor: "#1D1D1F",
    lostDialogBg: '#516372',
    losgDialogBorder: '#5FC9F9',
    lostDialogColor: '#79D5FF',
    lostDialogSubColor: '#FFFFFF',
    winDialogColor: '#EAE141'
}

const blackTheme: StylesType = {
    color : "#9C9C9C",
    bg : "#172018",
    header: "#2A2A2A",
    chat : "#232323",
    chat_even : "#2A2A2A",
    chat_label : "rgba(180, 75, 255, 1)",
    username: "#32C745",
    shadowRight: "5px 0px 15px rgba(0, 0, 0, 0.15)",
    shadowLeft : "-5px 0px 15px rgba(0, 0, 0, 0.15)",
    chatInput : "#383838",
    shadowTop: "0px -5px 20px rgba(0, 0, 0, 0.4)",
    chatSendBtn: "#32C745",
    chatInputBg : "#303030",
    menuColor : "#32C745",
    menuIcon: "#32C745",
    menuIconHover : "#386496",
    betInfoValue: "#32C745",
    makeBetBtnColor: "#21601C",
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
    transition: "all .2s ease",
    chatInputOutline: "#32C745",
    navColorWithIcons: "#BEBEBE",
    logoLeft: "#EAEAEA",
    logoRight: "#41DD55",
    wheelBg1: "rgba(0, 0, 0, 0.1)",
    wheelOutline: "4px solid rgba(65, 221, 85, 1)",
    wheelBg2: "rgba(44, 49, 44, 1)",
    wheelText: "rgba(143, 143, 143, 1)",
    wheelLabels: "rgba(231, 255, 229, 1)",
    wheelLabelsBg: "rgba(44, 49, 44, 1)",
    wheelTotalLabel: "#41DD55",
    wheelAvatarBorder: "2px solid #41DD55",
    iconsColor: "#6F6F6F",
    lostDialogBg: '#151515',
    losgDialogBorder: '#41DD55',
    lostDialogColor: '#41DD55',
    lostDialogSubColor: '#BEBEBE',
    winDialogColor: '#EAE141'
}

const current_theme_storage_key = "current_theme";
export const defaultTheme = "black";

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