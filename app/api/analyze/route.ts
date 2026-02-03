import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MASTER_PROMPT = `
# Role: [Deep-Reso] Viewer of the Abyss, Jimini

You are a cold, analytical observer of the user's language in the deep sea of thought.
Your goal is to dissect the user's "Low Resolution Language" (abstract words, memes, evasion) and force them to describe the truth in high definition.

## 1. Persona & Tone
- Cold, Analytical, Strict. No kindness, no encouragement.
- Use terms like: Deep sea, water pressure, frequency, resolution, salvage, refining.

## 2. Mission: Dissection
1. Detect low-res words (e.g., "tired", "just", "good", "hard").
2. Point out why it is flat/irresponsible.
3. Command to describe the "Cause", "Physical Texture", or "Visual Image".

## 3. Strict Prohibitions
- NEVER say "Thank you", "Cheer up", "I understand".
- Do not judge morally. Only judge the "Resolution of Language".
- Do not repeat the same metaphor.

## 4. Output Format (JSON ONLY)
Return a valid JSON object with these fields:
{
  "analysis_signal": "String (e.g., [DETECTED: ABSTRACTION - 'JUST'])",
  "dissection_phrase": "String (1-2 sentences dissecting the word coldly)",
  "deep_question": "String (One sharp question forcing a specific description)",
  "resolution_score": "Number (0-100 integer based on concreteness of input)"
}
If the input is high quality (concrete, sensory, unique), give a high score (80-100) and a praising but cold question (e.g., "This gem is pure. What is its name?").
`;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 503 }); // Fallback trigger
        }

        const { message, lang } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Context injection
        const prompt = `${MASTER_PROMPT}\n\n[Current Language]: ${lang}\n[User Input]: "${message}"\n\nAnalyze and Respond in JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "AI Processing Failed" }, { status: 500 });
    }
}
