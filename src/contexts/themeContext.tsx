import { createContext, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextData = {
    theme: Theme;
    toogleTheme: () => void;
}

type ThemeContextProviderProps = {
    children: ReactNode;
}

export const ThemeContext = createContext({} as ThemeContextData);

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const storageTheme = localStorage.getItem('theme');

        return (storageTheme ?? 'light') as Theme;
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    function toogleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{ theme, toogleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}