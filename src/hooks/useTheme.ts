import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';

export function useTheme() {
    const value = useContext(ThemeContext);
    return value;
}