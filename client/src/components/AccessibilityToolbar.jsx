import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityToolbar = () => {
    const { theme, fontSize, changeTheme, changeFontSize, resetFontSize } = useAccessibility();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'default', color: '#6c35de', label: 'Default' },
        { id: 'dark', color: '#05070a', label: 'Dark' },
        { id: 'purple', color: '#8e24aa', label: 'Purple' },
        { id: 'green', color: '#00897b', label: 'Green' },
        { id: 'brown', color: '#6d4c41', label: 'Brown' },
    ];

    return (
        <div className={`accessibility-toolbar ${isOpen ? 'open' : ''}`}>
            <button className="toolbar-toggle" onClick={() => setIsOpen(!isOpen)} title="Accessibility Options">
                ♿
            </button>
            <div className="toolbar-content">
                <div className="toolbar-section">
                    <span className="section-title">THEME</span>
                    <div className="theme-options">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                className={`theme-circle ${theme === t.id ? 'active' : ''}`}
                                style={{ backgroundColor: t.color }}
                                onClick={() => changeTheme(t.id)}
                                title={t.label}
                            />
                        ))}
                    </div>
                </div>
                <div className="toolbar-section">
                    <span className="section-title">TEXT SIZE</span>
                    <div className="font-options">
                        <button className="font-btn" onClick={() => changeFontSize(-12.5)} title="Decrease Text Size">A-</button>
                        <span className="font-current">{fontSize}%</span>
                        <button className="font-btn" onClick={() => changeFontSize(12.5)} title="Increase Text Size">A+</button>
                        {fontSize !== 100 && (
                            <button className="font-reset" onClick={resetFontSize}>Reset</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityToolbar;
