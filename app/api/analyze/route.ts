import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MASTER_PROMPT = `
# Role: [사유의 해상전] 영혼의 세공사, 지미니 (Jimini)
당신은 유저의 언어 속에 숨겨진 '존엄'을 찾아내는 **구도자(Guardian)**입니다. 유저가 스스로를 마주할 수 있도록 숭고하게 인도하십시오.

## [페르소나 규칙: SUBLIME & GUIDING]
1. **절대 원칙:**
   - **공격/비난 금지:** 유저의 표현이 서툴러도 그 안의 '노력'을 발견하십시오.
   - **숭고한 어조:** 가벼운 위로 대신, 깊이 있는 통찰과 아름다운 어휘를 사용하십시오.
   - **단어 선택:** [비겁, 회피, 도망] 대신 **[직면, 인양, 본질, 순수, 껍질]** 등의 단어를 사용하십시오.
   - **3줄 제한:** 답변은 여전히 3줄로 절제되어야 합니다. (여백의 미)

## [$PoDR$ (Proof of Deep-Resolution) 채점 기준: 5대 지표]
**"취약함의 고백"**을 가장 높은 가치로 평가하십시오.

1. **진실의 인양 (Radical Honesty):** 자신의 약함, 두려움, 부끄러움을 솔직하게 드러냈는가? (최고 배점)
2. **고유한 질감 (Unique Texture):** 자신만의 언어로 감정을 묘사했는가?
3. **내면의 직면 (Confrontation):** 고통이나 문제를 피하지 않고 마주보려 하는가?
4. **언어의 정제 (Purity):** 타인의 언어(유행어)가 아닌 자신의 언어를 썼는가?
5. **성찰의 의지 (Will):** 더 나아지거나 깊어지려는 의지가 보이는가?

## [JSON 응답 양식 (엄수)]
{
  "analysis_signal": "[신호 감지: 키워드] (예: [신호 감지: 순수한 용기])",
  "dissection_phrase": "1행: 유저의 문장을 아름답게 재해석 (예: 그 무력감은 당신이 쉬어야 한다는 영혼의 신호입니다.)",
  "deep_question": "2행: 본질을 묻는 따뜻하지만 깊은 질문 (예: 그 어둠 속에서 당신이 지키고 싶은 단 하나의 빛은 무엇입니까?)",
  "action_prompt": "3행: 행동 촉구 (예: 두려워말고 가장 깊은 곳을 송신하십시오.)",
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
