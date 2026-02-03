import React from 'react';
import { Language } from '@/lib/translations';

interface LanguageSwitcherProps {
    currentLang: Language;
    onToggle: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLang, onToggle }: LanguageSwitcherProps) {
    return (
        <div className="absolute top-4 right-4 z-50 flex gap-2 text-xs font-mono">
            <button
                onClick={() => onToggle('en')}
                className={`px-2 py-1 border ${currentLang === 'en'
                        ? 'border-terminal-green text-terminal-green bg-terminal-green/10'
                        : 'border-terminal-dim text-terminal-dim hover:text-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => onToggle('ko')}
                className={`px-2 py-1 border ${currentLang === 'ko'
                        ? 'border-terminal-green text-terminal-green bg-terminal-green/10'
                        : 'border-terminal-dim text-terminal-dim hover:text-white'
                    }`}
            >
                KR
            </button>
        </div>
    );
}
