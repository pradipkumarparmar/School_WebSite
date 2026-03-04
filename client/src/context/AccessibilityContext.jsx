import { createContext, useState, useEffect, useContext } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default');
    const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('fontSize')) || 100);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const rootSize = (fontSize / 100) * 16;
        document.documentElement.style.setProperty('--root-font-size', `${rootSize}px`);
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    const changeTheme = (newTheme) => setTheme(newTheme);
    const changeFontSize = (delta) => {
        setFontSize((prev) => {
            const next = prev + delta;
            return Math.min(Math.max(next, 75), 150);
        });
    };
    const resetFontSize = () => setFontSize(100);

    return (
        <AccessibilityContext.Provider value={{ theme, fontSize, changeTheme, changeFontSize, resetFontSize }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => useContext(AccessibilityContext);
