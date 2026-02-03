import { Language, translations } from './translations';
import { KO_DICTIONARY } from './locales/ko';
import { EN_DICTIONARY } from './locales/en';

export interface CheckResult {
    isValid: boolean;
    message?: string;
    penalty?: number;
    reward?: number;
    isGlitch?: boolean;
    diggingMessage?: string; // New: For "New Coordinate" feedback
}

export function calculateNewResolution(current: number, change: number): number {
    return Math.min(100, Math.max(0, current + change));
}

// Simple keyword extractor
function extractKeywords(input: string, lang: Language): string[] {
    if (lang === 'en') {
        // Basic English extraction: remove common stop words, find long words
        const comments = ["the", "and", "is", "that", "this", "it", "to", "of", "in", "for", "with", "on", "at", "my", "me"];
        return input.split(' ')
            .map(w => w.replace(/[^\w]/g, '').toLowerCase())
            .filter(w => w.length > 3 && !comments.includes(w));
    } else {
        // Simple Korean extraction heuristic
        // Split by space, remove common endings if possible (very naive), filter length >= 2
        // Avoiding complex NLP for now, just taking significant chunks
        return input.split(' ')
            .map(w => w.replace(/[.,!?]/g, ''))
            .filter(w => w.length >= 2 && !["나는", "내가", "너무", "정말", "진짜", "그리고", "하지만"].includes(w));
    }
}

export function checkInput(input: string, lang: Language, currentResolution: number): CheckResult {
    const dict = lang === 'ko' ? KO_DICTIONARY : EN_DICTIONARY;
    const lowerInput = input.trim().toLowerCase();

    // 0. Adaptive Difficulty & Zone Logic
    const difficultyMultiplier = currentResolution < 30 ? 0.5 : 1.0;

    // Zone determination
    let currentZone: 'sensation' | 'memory' | 'essence' = 'sensation';
    if (currentResolution > 60) currentZone = 'essence';
    else if (currentResolution > 30) currentZone = 'memory';

    // 1. Context Awareness (Special Triggers)
    for (const [key, value] of Object.entries(dict.special)) {
        if (lowerInput.includes(value.trigger)) {
            return {
                isValid: false,
                message: value.response,
                penalty: 5 * difficultyMultiplier,
                isGlitch: true
            };
        }
    }

    // 2. Dissection Logic (Abstract Words)
    const abstractWords = lang === 'ko'
        ? ["피곤", "좋아", "그냥", "몰라", "짜증", "대충", "힘들"]
        : ["tired", "good", "just", "dunno", "maybe", "hard"];

    for (const word of abstractWords) {
        if (lowerInput.includes(word)) {
            return {
                isValid: false,
                message: lang === 'ko'
                    ? "그 단어는 너무 납작합니다. 이 단어의 '입체감'을 설명하십시오. 육체의 비명입니까, 영혼의 고갈입니까?"
                    : "That word is too flat. Describe its dimensionality. Is it fatigue of the body or the soul?",
                penalty: 3 * difficultyMultiplier,
                isGlitch: true
            };
        }
    }

    // 3. Banned Word Categories
    for (const [catKey, category] of Object.entries(dict.categories)) {
        for (const word of category.words) {
            if (lowerInput.includes(word)) {
                const isCritical = currentResolution < 50;
                let penalty = isCritical ? 15 : 5;

                return {
                    isValid: false,
                    message: category.responses[Math.floor(Math.random() * category.responses.length)],
                    penalty: penalty,
                    isGlitch: true
                };
            }
        }
    }

    // 4. Density Check
    const minLength = lang === 'ko' ? 10 : 15;
    if (input.trim().length < minLength) {
        return {
            isValid: false,
            message: dict.errors.low_density,
            penalty: 0,
            isGlitch: false
        };
    }

    // 5. Success & Infinite Digging Engine
    const isHighQuality = input.length > 30;
    const reward = isHighQuality ? 15 : 10;
    let rewardMsg = "";

    // Digging Logic: Extract keyword and generate question based on Zone
    const keywords = extractKeywords(input, lang);
    let diggingMsg = undefined;

    if (keywords.length > 0) {
        // Pick longest keyword for better 'weight'
        const keyword = keywords.reduce((a, b) => a.length > b.length ? a : b);

        // Select question type based on Zone
        const t = translations[lang];
        let questionTemplate = "";

        if (currentZone === 'sensation') questionTemplate = t.digging.sensation;
        else if (currentZone === 'memory') questionTemplate = t.digging.origin;
        else questionTemplate = t.digging.substitution;

        const question = questionTemplate.replace('{keyword}', keyword);
        const prelude = t.digging.prelude.replace('{keyword}', keyword);

        // We bundle the prelude and question.
        // Or we can return them to be displayed separately.
        // For now, let's append to rewardMsg or return as separate `diggingMessage`
        diggingMsg = `${prelude}\n\n${question}`;
    }

    // If no digging triggered (no keywords), fallback to generic reward
    if (!diggingMsg) {
        rewardMsg = dict.rewards.fog_clearing[Math.floor(Math.random() * dict.rewards.fog_clearing.length)];
    }

    return {
        isValid: true,
        message: rewardMsg || undefined, // If digging, we might not show generic reward text, or show both
        diggingMessage: diggingMsg,
        reward: reward,
        isGlitch: false
    };
}
