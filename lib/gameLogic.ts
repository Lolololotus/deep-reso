import { translations, Language } from './translations';

export const BANNED_WORDS = [
    "오글거려",
    "짜증나",
    "대박",
    "에바",
    "극혐",
    "그냥",
    "몰라",
    "대충",
    "글쎄"
];

// Simple English banned words for demo purposes
export const BANNED_WORDS_EN = [
    "just",
    "whatever",
    "idk",
    "dunno",
    "boring"
];

export interface GameState {
    resolution: number;
    isGameOver: boolean;
}

export function checkInput(input: string, lang: Language = 'ko'): { isValid: boolean; message?: string } {
    const lowerInput = input.trim().toLowerCase();

    const targetBannedWords = lang === 'ko' ? BANNED_WORDS : BANNED_WORDS_EN;
    const warningMsg = translations[lang].warning_sink;

    // Check for banned words
    for (const word of targetBannedWords) {
        if (lowerInput.includes(word)) {
            return { isValid: false, message: warningMsg };
        }
    }

    return { isValid: true };
}

export function calculateResolutionIncrease(currentResolution: number): number {
    // Simple logic: +10% per valid input, capped at 100
    return Math.min(100, currentResolution + 10);
}
