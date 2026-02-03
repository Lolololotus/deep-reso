import { Language } from './translations';
import { KO_DICTIONARY } from './locales/ko';
import { EN_DICTIONARY } from './locales/en';

export interface CheckResult {
    isValid: boolean;
    message?: string;
    penalty?: number;
    reward?: number;
}

export function checkInput(input: string, lang: Language, currentResolution: number): CheckResult {
    const dict = lang === 'ko' ? KO_DICTIONARY : EN_DICTIONARY;
    const lowerInput = input.trim().toLowerCase(); // Korean input usually kept as is, but for safety

    // 1. Context Awareness (Special Triggers)
    // Check special cases first (e.g., "오히려 좋아")
    for (const [key, value] of Object.entries(dict.special)) {
        if (lowerInput.includes(value.trigger)) {
            return {
                isValid: false,
                message: value.response,
                penalty: 5 // Standard penalty for specific context failures
            };
        }
    }

    // 2. Banned Word Categories
    for (const [catKey, category] of Object.entries(dict.categories)) {
        for (const word of category.words) {
            if (lowerInput.includes(word)) {
                // Critical Penalty Logic
                // If Resolution is low (< 50%) and they use memes/banned words -> CRITICAL HIT
                const isCritical = currentResolution < 50;
                const penalty = isCritical ? 15 : 5;

                // Random adversarial response from the category
                const randomResponse = category.responses[Math.floor(Math.random() * category.responses.length)];

                return {
                    isValid: false,
                    message: randomResponse,
                    penalty: penalty
                };
            }
        }
    }

    // 3. Density Check (Length)
    const minLength = lang === 'ko' ? 15 : 20; // roughly 5 words or 20 chars
    if (input.trim().length < minLength) {
        return {
            isValid: false,
            message: dict.errors.low_density,
            penalty: 0 // No penalty, just rejection
        };
    }

    // 4. Success (Reward)
    // Reward logic: +10 base, maybe +15 if very long?
    // For now simple +10
    const reward = 10;
    const rewardMsg = dict.rewards.fog_clearing[Math.floor(Math.random() * dict.rewards.fog_clearing.length)];

    return {
        isValid: true,
        message: rewardMsg,
        reward: reward
    };
}

export function calculateNewResolution(current: number, change: number): number {
    return Math.min(100, Math.max(0, current + change));
}
