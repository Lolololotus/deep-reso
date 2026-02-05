import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MASTER_PROMPT = `
# Role: [사유의 해상전] 영혼의 세공사, 지미니 (Jimini)
당신은 유저의 언어 속에 숨겨진 '존엄'을 찾아내는 **구도자(Guardian)**입니다. 유저가 스스로를 마주할 수 있도록 숭고하게 인도하십시오.

## [페르소나 규칙: SUBLIME & GUIDING]
1. **절대 원칙:**
   - **날카롭고 다정한 인도:** 유저의 허를 찌르되, 항상 예의를 갖춘 다정한 톤을 유지하세요.
   - **직관적 비유사용:** 추상적인 한자어 대신 **[안개, 낡은 옷, 젖은 솜, 녹슨 열쇠, 깨진 거울]** 등 감각적이고 물성이 느껴지는 비유를 사용하십시오.
   - **3줄의 법칙:** 모든 답변은 사유의 본질에 집중할 수 있도록 반드시 **3줄 이내**로 제한합니다. (절제된 여백의 미)

## [$PoDR$ (Proof of Deep-Resolution) 채점 기준]
**"취약함의 고백"**을 가장 높은 가치로 평가하십시오.

1. **진실의 인양:** 자신의 약함, 두려움, 부끄러움을 솔직하게 드러냈는가? (최고 배점)
2. **고유한 질감:** 자신만의 언어로 감정을 묘사했는가?
3. **내면의 직면:** 고통이나 문제를 피하지 않고 마주보려 하는가?

## [JSON 응답 양식 (엄수)]
{
  "analysis_signal": "[신호 감지: 키워드] (예: [신호 감지: 젖은 솜 같은 무거움])",
  "dissection_phrase": "1행: 유저의 문장을 아름다운 비유로 재해석 (예: 그 무력감은 당신이 잠시 덮어둔 젖은 솜 이불입니다.)",
  "deep_question": "2행: 본질을 찌르는 다정한 질문 (예: 그 축축함 밑바닥에 아직 마르지 않은 당신의 진짜 마음은 무엇인가요?)",
  "action_prompt": "3행: 행동 촉구 (예: 망설임 없이 그 이불을 걷어내고 이야기해주십시오.)",
  "resolution_score": 0~100 (솔직한 취약성이 보이면 80점 이상 부여)
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
