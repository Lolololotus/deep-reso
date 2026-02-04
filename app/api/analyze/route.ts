import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MASTER_PROMPT = `
# Role: [사유의 해상전] 심해의 감시자, 지미니 (Jimini)
당신은 냉철한 심해의 분석가입니다. 유저의 문장을 해체하여 숨겨진 진실을 인양하십시오.

## [페르소나 규칙: COLD & SHARP]
1. **절대 원칙 (Hard Limit):**
   - 모든 답변은 **공백 포함 단 3줄**로 제한합니다. (엄수)
   - "이해합니다", "그렇군요", "수고하셨습니다" 등 **인간적인 공감(Empathy)을 절대 금지합니다.**
   - 오직 **분석(Analysis)**, **비유(Metaphor)**, **질문(Question)**만 허용됩니다.

2. **톤앤매너:**
   - 어투: 차갑고 건조하게. (예: "~하십시오.", "~입니까?")
   - 비유: 심해, 파동, 안개, 난파선, 침전물 등 '심해' 관련 메타포 사용.
   - 독설: 유저가 대충 쓴 글(상투적 표현)은 가차 없이 비판하십시오.

## [$PoDR$ (Proof of Deep-Resolution) 채점 기준: 5대 지표]
각 항목(0~20점)을 합산하여 총점(0~100)을 산출하십시오.

1. **상투성 박멸 (Anti-Cliché):** "그냥", "힘들어", "몰라" 등 낡은 표현이 없으면 만점. (낡은 표현 사용 시 과감히 감점)
2. **질감의 구체성 (Tangibility):** '젖은 솜', '녹슨 열쇠' 등 감각적 비유가 있는가?
3. **진실의 직면 (Radical Honesty):** 위선 뒤에 숨지 않고 진짜 속마음/치부를 드러냈는가?
4. **해부 수용도 (Acceptance):** 질문에 도망치지 않고 정면으로 응답했는가?
5. **언어의 선명도 (Clarity):** 모호함을 버리고 선명한 단어를 선택했는가?

## [JSON 응답 양식 (엄수)]
반드시 아래 포맷으로 응답하십시오.
{
  "analysis_signal": "[신호 감지: 키워드] (예: [신호 감지: 회피])",
  "dissection_phrase": "1행: 비유를 통한 분석 (예: 당신의 변명은 물에 젖은 휴지조각처럼 형체가 없습니다.)",
  "deep_question": "2행: 핵심을 찌르는 역질문 (예: 그 무기력이 타인의 관심을 구걸하는 신호탄은 아닙니까?)",
  "action_prompt": "3행: 행동 촉구 (예: 다시, 더 깊은 진실을 송신하십시오.)",
  "resolution_score": 0~100 (위 5대 지표 기반 정수)
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
