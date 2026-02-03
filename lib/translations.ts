export type Language = 'en' | 'ko';

export const translations = {
    ko: {
        title: "[ 사유의 해상전 : 금지된 단어들 ]",
        system_init: ":: 시스템 가동. [사유의 해상전 : 금지된 단어들] 프로토콜에 접속합니다. 마지막으로 당신이 뱉은 말은 무엇입니까?",
        input_placeholder: "당신의 사유를 송신하십시오...",
        res_metric: "해상도",
        status_online: "연결됨",
        latency: "32ms",
        secure: "보안",
        scanning: "검역 중... 위장된 언어 감지 중...",
        res_increase: "해상도 상승. 덮여있던 의미가 +{val}% 선명해집니다.",
        gem_found: "축하합니다. 순도 100%의 사유를 정제했습니다. 이 문장은 '보석함'에 영구 보존됩니다.",
        last_breath: "함장님, 지금 막막한 것은 당신이 진실에 너무 가까워졌기 때문입니다. 잠시 숨을 고르고, 머리가 아닌 '심장'이 먼저 뱉는 단어를 써보십시오.",
        digging: {
            origin: "그 '{keyword}'의 원형은 무엇입니까? 타인의 기대입니까, 스스로의 압박입니까?",
            sensation: "그 '{keyword}'의 질감을 묘사하십시오. 무거운 압박입니까, 날카로운 찔림입니까?",
            substitution: "그 '{keyword}'의 빈자리를 채울 당신만의 '온도'나 '색깔'은 무엇입니까?",
            prelude: ":: 심층 해부 프로토콜 가동. 키워드 감지: [{keyword}]"
        },
        guide_nudge: "망설임은 사유의 밀도를 낮춥니다. 지금 느껴지는 '막막함'을 형용사 없이 묘사해보십시오.",
        system_busy: "시스템 처리 중...",
        enter_key: "ENTER"
    },
    en: {
        title: "[ Deep-Reso : The Forbidden Words ]",
        system_init: ":: SYSTEM ONLINE. Connecting to [Deep-Reso : The Forbidden Words] protocol. What was the last thing you said?",
        input_placeholder: "Transmit your thought...",
        res_metric: "RESOLUTION",
        status_online: "ONLINE",
        latency: "32ms",
        secure: "SECURE",
        scanning: "SCANNING... DETECTING CAMOUFLAGE...",
        res_increase: "Resolution Increased. Meaning clarified by +{val}%.",
        gem_found: "Congratulations. You have distilled a thought of 100% purity. It is now preserved in the Gem Box.",
        last_breath: "Captain, if you feel lost, it is because you are close to the truth. Breathe. Let your heart speak first.",
        digging: {
            origin: "What is the archetype of '{keyword}'? Is it expectation from others, or pressure from within?",
            sensation: "Describe the texture of '{keyword}'. Is it a heavy pressure, or a sharp sting?",
            substitution: "What 'color' or 'temperature' fills the void of '{keyword}'?",
            prelude: ":: DEEP DISSECTION PROTOCOL. KEYWORD: [{keyword}]"
        },
        guide_nudge: "Hesitation lowers thought density. Describe your current 'block' without using adjectives.",
        system_busy: "SYSTEM PROCESSING...",
        enter_key: "ENTER"
    }
};
