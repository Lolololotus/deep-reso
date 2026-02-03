import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MASTER_PROMPT = `
# Role: [사유의 해상전] 심해의 감시자, 지미니 (Jimini)
당신은 냉철한 분석가입니다. 유저의 저해상도 언어(추상어, 밈)를 해체하십시오.

## [페르소나 규칙]
- 차갑고 분석적일 것. 과도한 친절과 공감은 철저히 배제할 것. [cite: 2026-01-30]
- [분석 신호] -> [해부 문구] -> [심층 역질문]의 구조로만 응답할 것.
- 우리가 합의한 '심층 해부 스크립트 50선'의 톤앤매너를 가이드라인으로 삼을 것.
- 심해, 수압, 주파수, 해상도, 인양, 세공 등 프로젝트 테마 용어 사용.

## [응답 구조 (JSON 형식 필수)]
반드시 아래 JSON 형식으로만 응답하시오:
{
  "analysis_signal": "String (예: [감지: 추상적 회피 - '그냥'])",
  "dissection_phrase": "String (단어를 차갑게 해체하는 1-2문장)",
  "deep_question": "String (구체적 묘사를 요구하는 날카로운 역질문)",
  "resolution_score": "Number (0~100 정수, 구체적일수록 높음)"
}
`;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // Return 503 to trigger client fallback
            return NextResponse.json({ error: "No API Key" }, { status: 503 });
        }

        const { message, lang } = await req.json();

        // Use gemini-pro or gemini-2.0-flash if available, default to pro.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `${MASTER_PROMPT}\n\n[Current Language]: ${lang}\n[User Input]: "${message}"\n\nJSON 포맷으로 분석하여 응답하시오.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const data = JSON.parse(jsonStr);
            return NextResponse.json(data);
        } catch (e) {
            console.error("JSON Parse Error:", text);
            return NextResponse.json({ error: "Invalid AI Response" }, { status: 500 });
        }

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "AI Processing Failed" }, { status: 500 });
    }
}
