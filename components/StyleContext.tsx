import React, { useEffect } from "react";

export type ThemeType = "white" | "black";

export interface StylesType {
    header: string
}

export interface StyleContextType {
    styles: StylesType,
    theme: ThemeType,
    toggleTheme(): void,
}

const whiteTheme: StylesType = {
    header: "rgb(88, 153, 227)"
}

const blackTheme: StylesType = {
    header: "rgb(46, 15, 64)"
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