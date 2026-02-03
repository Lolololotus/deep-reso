import { Language, translations } from './translations';
import { KO_DICTIONARY } from './locales/ko';
import { EN_DICTIONARY } from './locales/en';

export interface CheckResult {
    isValid: boolean;
    message?: string;
    penalty?: number;
    reward?: number;
    isGlitch?: boolean;
    diggingMessage?: string;
    usedQuestionId?: string; // To update the anti-repetition queue
}

export function calculateNewResolution(current: number, change: number): number {
    return Math.min(100, Math.max(0, current + change));
}

// Category Mapping
type DiggingCategory = 'fatigue' | 'attitude' | 'language' | 'ambiguity' | 'joy';

function determineCategory(input: string, lang: Language): DiggingCategory {
    const text = input.toLowerCase();

    // Keywords mapping
    if (lang === 'ko') {
        if (/피곤|힘들|지쳐|죽겠|졸려|두통|방전|무기력|싫어|짜증|우울/.test(text)) return 'fatigue';
        if (/착하|다정|성격|마음|화나|열받|무시|자존심|겸손|배려|솔직/.test(text)) return 'attitude';
        if (/말|대화|침묵|표현|설명|이해|소통|글|문장|단어/.test(text)) return 'language';
        if (/그냥|글쎄|몰라|아마|대충|애매|별로|그저/.test(text)) return 'ambiguity';
        if (/좋아|기뻐|행복|신나|즐거|만족|성공|웃겨|사랑|최고/.test(text)) return 'joy';
    } else {
        if (/tired|exhaust|hard|headache|drain|lazy|hate|annoy|depress/.test(text)) return 'fatigue';
        if (/kind|nice|mean|angry|proud|humble|honest|care|ignore/.test(text)) return 'attitude';
        if (/say|talk|speak|word|silent|quiet|explain|mean/.test(text)) return 'language';
        if (/just|dunno|maybe|guess|blur|vag/.test(text)) return 'ambiguity';
        if (/good|happy|love|great|fun|joy|laugh|best/.test(text)) return 'joy';
    }

    // Default to ambiguity if unclear, or language (meta)
    return 'ambiguity';
}

// Simple keyword extractor (Visual only)
function extractKeyword(input: string, lang: Language): string {
    const words = input.split(' ').filter(w => w.length >= 2);
    // Return random word from input or last word
    return words.length > 0 ? words[Math.floor(Math.random() * words.length)] : input;
}

export function checkInput(input: string, lang: Language, currentResolution: number, recentQuestionIndices: string[] = []): CheckResult {
    const dict = lang === 'ko' ? KO_DICTIONARY : EN_DICTIONARY;
    const lowerInput = input.trim().toLowerCase();

    // 0. Adaptive Difficulty
    const difficultyMultiplier = currentResolution < 30 ? 0.5 : 1.0;

    // 1. Context Awareness
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

    // 2. Dissection Logic (Abstract Words) - Still valid as a quick check
    const abstractWords = lang === 'ko'
        ? ["피곤", "좋아", "그냥", "몰라", "짜증", "대충"]
        : ["tired", "good", "just", "dunno", "maybe"];

    // Only trigger basic dissection if input is SHORT. If long, use Deep Digging.
    if (input.length < 20) {
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

    // 5. Success & Infinite Digging Engine (v3.1)
    const isHighQuality = input.length > 30;
    const reward = isHighQuality ? 15 : 10;

    // Digging Logic
    const category = determineCategory(input, lang);
    const questions = translations[lang].digging_categories[category];

    // Anti-Repetition Logic
    // Filter out questions that are in recentQuestionIndices
    // We identify questions by "category_index"
    const availableIndices = questions
        .map((q, idx) => ({ q, id: `${category}_${idx}` }))
        .filter(item => !recentQuestionIndices.includes(item.id));

    let diggingMsg = undefined;
    let usedQuestionId = undefined;

    if (availableIndices.length > 0) {
        const selected = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const keyword = extractKeyword(input, lang);
        const prelude = translations[lang].digging_prelude.replace('{keyword}', keyword);

        diggingMsg = `${prelude}\n\n${selected.q}`;
        usedQuestionId = selected.id;
    } else {
        // FALLBACK: Signal Instability (Queue is full or no questions left)
        // Or just clear queue?
        // User requested: "Signal Instability" Glitch
        return {
            isValid: true, // It's valid density, but system failure
            message: translations[lang].system_busy,
            isGlitch: true, // Strong glitch
            reward: reward // Still acknowledge effort
        };
    }

    return {
        isValid: true,
        diggingMessage: diggingMsg,
        usedQuestionId: usedQuestionId,
        reward: reward,
        isGlitch: false
    };
}
