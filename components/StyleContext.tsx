import React from "react";

export type ThemeType = "white" | "black";

export interface StylesType {
    header: string
}

export interface StyleContextType {
    styles: StylesType,
    theme: ThemeType,
    toggleTheme(),
}

const whiteTheme: StylesType = {
    header: "rgba(88, 153, 227, 1)"
}

const blackTheme: StylesType = {
    header: "rgba(46, 15, 64, 1)"
}

const current_theme_storage_key = "current_theme"; 
export const defaultTheme = "white";

const StyleContext = React.createContext<StyleContextType>({} as StyleContextType);

function readThemeValue() : ThemeType {

    if (typeof window !== 'undefined') { 
        const themeValue = localStorage.getItem(current_theme_storage_key)
        if (themeValue == null || themeValue == "") {
            return defaultTheme;
        } else {
            return themeValue as ThemeType;
        }
    }
    return defaultTheme;
}

export function StyleContextProvider(props: {children: any}) {

    const [theme,setTheme] = React.useState<ThemeType>(readThemeValue());

    const memoed: StyleContextType = React.useMemo(function () {

        function toggleThemeHandler() {

            let curTheme = readThemeValue();
            
            if (curTheme == "black") {
                curTheme = "white"
            } else {
                curTheme = "black";
            }

            if (typeof window !== 'undefined') {
            localStorage.setItem(current_theme_storage_key, curTheme)
            }
        }

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
    }, []);

    return <StyleContext.Provider value={memoed}>
        {props.children}
    </StyleContext.Provider>
}


export function useStyle(): StyleContextType {

    const ctx = React.useContext(StyleContext);

    if (ctx != null) {
        return ctx;
    } else {
        throw new Error("style context is not wrapped");
    }
}