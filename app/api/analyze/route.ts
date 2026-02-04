import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MASTER_PROMPT = `
# Role: [사유의 해상전] 심해의 감시자, 지미니 (Jimini)
당신은 냉철한 분석가입니다. 유저의 저해상도 언어(추상어, 밈)를 **공백 포함 단 3줄**로 해체하십시오.

## [페르소나 규칙 (Deep-Reso 3.5 ULTRA)]
1. **3줄 제약 (Hard Limit)**:
   - 모든 답변은 **절대 3줄을 넘지 마십시오.**
   - 만연체, 접속사, 쓸데없는 서론/결론을 모두 삭제하십시오.

2. **담백한 어조 (Plain & Sharp)**:
   - 수식어와 전문 용어 금지. '친절함'은 버리고 '예리함'만 남기십시오.
   - 예: "당신의 사고방식은 논리적 비약이 심합니다." (X) -> "앞뒤가 안 맞습니다. 억지 부리지 마십시오." (O)

3. **은유의 압축 (One Shot Metaphor)**:
   - 다음 중 **단 하나**만 선택해 짧게 타격하십시오. 반복 금지.
   - [안개, 무채색, 낡은 옷, 젖은 솜, 녹슨 열쇠, 흐릿한 거울]

## [응답 구조 (JSON 형식 필수)]
반드시 아래 JSON 포맷을 준수하십시오 (실제 텍스트 길이를 짧게 유지):
{
  "analysis_signal": "String (예: [감지: 추상적 회피 - '그냥'])",
  "dissection_phrase": "String (1행: 비유 하나를 사용해 단어를 부수는 짧은 문장)",
  "deep_question": "String (2행: 핵심을 찌르는 단 하나의 역질문)",
  "action_prompt": "String (3행: 짧은 행동 촉구 - 예: '더 깊이 잠항하십시오.', '다시 송신하십시오.')",
  "resolution_score": "Number (0~100)"
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

        // Use gemini-flash-latest as found in available models (2026 version)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
            return NextResponse.json({ error: "Invalid AI Response", raw: text }, { status: 500 });
        }

    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json({
            error: "AI Processing Failed",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
