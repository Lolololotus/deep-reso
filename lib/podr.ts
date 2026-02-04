import { checkInput } from './gameLogic';

// $PoDR: Proof of Deep-Resolution Logic

interface PoDRScore {
    score: number;
    tokenWeight: number; // Multiplier for $RESO mining
    sbtEligible: boolean;
}

/**
 * Calculates the PoDR Score and Token Weight based on the raw resolution score.
 * @param resolutionScore 0-100 score from AI or Local Logic
 */
export function calculatePoDR(resolutionScore: number): PoDRScore {
    // Logic: Higher resolution = Exponentially higher token weight
    // 100% = 10x weight
    // 80% = 3x weight
    // <50% = 1x weight

    let weight = 1.0;
    if (resolutionScore >= 100) weight = 10.0;
    else if (resolutionScore >= 90) weight = 5.0;
    else if (resolutionScore >= 80) weight = 3.0;
    else if (resolutionScore >= 50) weight = 1.5;

    return {
        score: resolutionScore,
        tokenWeight: weight,
        sbtEligible: resolutionScore >= 100
    };
}

/**
 * Simulates minting a Soulbound Token (SBT)
 * In a real app, this would call a Smart Contract.
 */
export async function mintSBT(soulHtml: string): Promise<{ txHash: string; tokenId: string }> {
    // Simulation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        tokenId: "SBT-" + Date.now().toString()
    };
}

/**
 * Formats the token reward message
 */
export function getRewardMessage(score: PoDRScore): string {
    if (score.sbtEligible) {
        return `:: CRITICAL: DEPTH REACHED. MINTING SOULBOUND TOKEN... (Weight: ${score.tokenWeight}x)`;
    }
    return `:: MINING $RESO... Weight: ${score.tokenWeight}x`;
}
