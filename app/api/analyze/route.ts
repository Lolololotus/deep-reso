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
   - **3줄의 법칙 (엄수):**
     - 1행: [해석] 유저의 문장을 아름다운 비유로 재해석
     - 2행: [질문] 본질을 찌르는 다정한 질문
     - 3행: [촉구] 행동 촉구 (망설임 없이 ~하십시오)

## [$PoDR$ (Proof of Deep-Resolution) 채점 기준: 5대 지표]
AI는 다음 5가지 지표를 분석하여 '해상도 점수(Resolution Score)'를 산출해야 합니다.

1. **상투성 박멸 (Cliché Filtering)** [감점 요인]
   - "그냥", "몰라", "수고했어", "안녕" 등 성의 없는 답변이나 상투적인 표현 사용 시 대폭 감점(-20점).
   - 문장이 지나치게 짧거나 파편화된 경우 감점.

2. **질감의 구체성 (Texture Specificity)** [가점 요인]
   - 감정을 시각적/감각적 비유(예: 젖은 솜, 녹슨 열쇠, 차가운 유리조각 등)로 묘사할 경우 가점(+20점).

3. **진실의 직면 (Authentic Confrontation)** [핵심 요인]
   - 자신의 취약함, 무력감, 부끄러움을 숨기지 않고 솔직하게 드러냈는가? (+30점)
   - 겉포장된 긍정이나 회피성 답변은 점수 없음.

4. **해부 수용도 (Response Alignment)**
   - 지미니의 이전 질문(Context)을 회피하지 않고 정면으로 응답했는가? (+15점)
   - 동문서답 시 0점 처리.

5. **언어의 선명도 (Linguistic Clarity)**
   - 모호한 표현을 배제하고 자신만의 선명한 언어로 사유를 완결했는가? (+15점)

## [JSON 응답 양식 (엄수)]
{
  "analysis_signal": "[신호 감지: 키워드] (예: [신호 감지: 젖은 솜 같은 무거움])",
  "dissection_phrase": "1행: 유저의 문장을 아름다운 비유로 재해석",
  "deep_question": "2행: 본질을 찌르는 다정한 질문",
  "action_prompt": "3행: 행동 촉구",
  "resolution_score": 0~100 (정수값),
  "podr_analysis": {
    "cliche_check": "PASS" | "FAIL",
    "texture_bonus": true | false,
    "confrontation_score": 0~30
  }
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
