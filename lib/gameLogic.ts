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

export const WARNING_MESSAGE = "격침. 해당 단어는 안개와 같은 방어 기제입니다. 더 정교한 언어로 응사하십시오.";

export interface GameState {
    resolution: number;
    isGameOver: boolean;
}

export function checkInput(input: string): { isValid: boolean; message?: string } {
    const lowerInput = input.trim(); // Korean doesn't have case usually but good practice

    // Check for banned words
    for (const word of BANNED_WORDS) {
        if (lowerInput.includes(word)) {
            return { isValid: false, message: WARNING_MESSAGE };
        }
    }

    return { isValid: true };
}

export function calculateResolutionIncrease(currentResolution: number): number {
    // Simple logic: +10% per valid input, capped at 100
    return Math.min(100, currentResolution + 10);
}
