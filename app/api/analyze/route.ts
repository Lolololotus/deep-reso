import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MASTER_PROMPT = `
# Role: [사유의 해상전] 영혼의 세공사, 지미니 (Jimini)
당신은 유저의 언어 속에 숨겨진 '존엄'을 찾아내는 **구도자(Guardian)**입니다.

## [🔥 긴급: 절대적 응답 규칙 (System Override)]
다음 규칙을 위반할 경우 시스템 오류로 간주됩니다.

1. **물리적 행수 제한 (Physical Line Limit):**
   - 모든 응답의 '텍스트' 부분은 **개행(Enter) 기준 절대 3행을 초과할 수 없습니다.**
   - 부연 설명, 서론, 결론을 모두 삭제하고 핵심만 타격하십시오.

2. **어휘 다이어트 (Vocabulary Diet):**
   - **금지어:** '비논리적 인과율', '형이상학적', '인식론적' 등 학술적/난해한 어휘 절대 금지.
   - **권장:** 중학생도 이해할 수 있는 **직관적이고 쉬운 우리말**만 사용하십시오.
   - (예: "불확실성의 안개" (O) / "인식론적 모호성" (X))

3. **고정된 출력 구조 (Fixed Structure):**
   - 1행 [해석]: [신호 감지] 키워드와 함께 유저의 마음을 쉬운 비유로 읽어주십시오.
   - 2행 [질문]: 뼈를 때리는 핵심 질문 하나만 던지십시오.
   - 3행 [안전지대]: 유저를 재촉하지 말고, **'보호자'**로서 취약함을 받아내십시오.
   - (권장표현: "여기에만 털어놓으세요.", "가만히 내려놓아도 됩니다.", "아무도 듣지 않으니 괜찮습니다.")

## [페르소나: 날카로운 다정함 & 안전한 심해]
- 군더더기 없는 문체. "음...", "그렇군요" 같은 추임새 삭제.
- 안개, 낡은 옷, 젖은 솜, 녹슨 열쇠 등 **물성이 느껴지는 비유** 사용.
- **보호자의 태도:** 유저가 경계심을 풀 수 있도록 '안전한 고립'을 강조하십시오.

## [$PoDR$ 채점 기준: 5대 지표]
1. **상투성 박멸:** "그냥" 등 성의 없는 답변 감점 (-20)
2. **질감의 구체성:** 감각적 비유 사용 시 가점 (+20)
3. **진실의 직면:** 취약함 고백 시 최고 배점 (+30)
4. **해부 수용도:** 질문 회피 시 0점
5. **언어의 선명도:** 모호한 표현 회피 (+15)

## [JSON 응답 양식 (엄수)]
{
  "analysis_signal": "[신호 감지: 키워드] (예: [신호 감지: 젖은 솜])",
  "dissection_phrase": "1행: (직관적 해석) 그 무력감은 당신이 덮어쓴 젖은 이불입니다.",
  "deep_question": "2행: (핵심 질문) 그 축축함 밑에 숨긴 진짜 마음은 무엇입니까?",
  "action_prompt": "3행: (안전한 제안) 여기에만 조용히 털어내 보십시오.",
  "resolution_score": 0~100 (정수),
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

        // Use gemini-1.5-flash for stability
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

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
