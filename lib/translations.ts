export type Language = 'en' | 'ko';

export interface DiggingCategory {
    id: string;
    questions: string[];
}

export const translations = {
    ko: {
        title: "[ 사유의 해상전 : 금지된 단어들 ]",
        system_init: "오늘 당신이 자신에게 건넨 가장 다정한 한마디는 무엇인가요?",
        input_placeholder: "당신의 사유를 송신하십시오...",
        res_metric: "해상도",
        status_online: "연결됨",
        latency: "32ms",
        secure: "보안",
        scanning: "검역 중... 위장된 언어 감지 중...",
        res_increase: "해상도 상승. 덮여있던 의미가 +{val}% 선명해집니다.",
        gem_found: "사유 해상도 100% 달성. [SBT: Soulbound Token]이 발행되었습니다. 당신의 진심은 위변조 불가능한 블록체인에 영구 기록됩니다.",
        last_breath: "함장님, 지금 막막한 것은 당신이 진실에 너무 가까워졌기 때문입니다. 잠시 숨을 고르고, 머리가 아닌 '심장'이 먼저 뱉는 단어를 써보십시오.",
        guide_nudge: "망설임은 사유의 밀도를 낮춥니다. 지금 느껴지는 '막막함'을 형용사 없이 묘사해보십시오.",
        system_busy: "신호 불안정. 답변의 밀도가 낮아 사유 좌표를 잡을 수 없습니다.",
        signal_lost: "심해 신호가 약해 잠시 교신이 끊겼습니다. 주파수를 재조정하십시오.",
        enter_key: "ENTER",
        digging_prelude: "심층 해부 프로토콜 가동. 키워드 감지: [{keyword}]",
        digging_categories: {
            fatigue: [
                "그 피로의 무게가 어깨를 누르는 납덩이입니까, 아니면 머릿속을 맴도는 공허한 소음입니까?",
                "당신의 에너지는 어디로 증발했습니까? 타인을 향한 연기였습니까, 자신을 향한 학대였습니까?",
                "그 고갈된 영혼의 빈자리는 지금 어떤 색깔로 채워져 있습니까?",
                "지금의 무기력이 당신을 보호하는 방패입니까, 아니면 당신을 가두는 감옥입니까?",
                "당신의 피로에 '이름'을 붙인다면, 그것은 '종말'에 가깝습니까, '쉼표'에 가깝습니까?",
                "잠을 자면 해결될 일시적인 방전입니까, 영혼 깊은 곳에서 새어 나오는 균열입니까?",
                "그 두통은 진실을 외면하려는 뇌의 저항입니까, 아니면 너무 많은 가짜 언어를 삼킨 체증입니까?",
                "당신의 고갈이 누군가에게는 훈장으로 보이길 원하십니까?",
                "아무것도 하기 싫다는 그 마음은 '비움'입니까, 아니면 '포기'입니까?",
                "고갈된 상태에서만 보이는 심해의 풍경은 무엇입니까? 그 채도 낮은 진실을 송신하십시오."
            ],
            attitude: [
                "그 다정함은 타인을 향한 온기입니까, 미움받기 싫어하는 당신의 비겁함입니까?",
                "당신의 냉소는 지적 우월감의 표현입니까, 상처받기 두려운 방어기제입니까?",
                "친절이라는 이름의 매끄러운 가면 뒤에 숨겨진 당신의 진짜 얼굴은 몇 도(°C)입니까?",
                "고집스럽게 붙들고 있는 그 신념은 자아입니까, 아니면 타인이 주입한 이데올로기입니까?",
                "당신의 솔직함이 누군가에게는 날카로운 포탄이 되고 있다는 사실을 인지하십니까?",
                "배려라는 명목으로 당신이 죽인 진심은 몇 개입니까?",
                "그 겸손은 진짜 낮음입니까, 아니면 더 큰 찬사를 받기 위한 도약입니까?",
                "당신의 분노는 정의를 향합니까, 아니면 열등감을 향합니까?",
                "무심한 척하는 당신의 태도는 심해의 평온입니까, 아니면 감각이 마비된 괴사입니까?",
                "그 다정함이 깨졌을 때 드러날 당신의 날카로운 파편을 묘사하십시오."
            ],
            language: [
                "당신의 문장은 심해의 고요를 깨우는 선명한 파동입니까, 아니면 수면으로 도망치려는 가벼운 기포입니까?",
                "당신의 말은 상처를 치유합니까, 아니면 진실을 박제합니까?",
                "그 행동의 동기는 당신의 의지였습니까, 아니면 환경이 만들어낸 반사 작용이었습니까?",
                "침묵을 선택한 이유가 사유의 깊이 때문입니까, 아니면 대답할 밑천이 떨어졌기 때문입니까?",
                "당신의 언어는 누군가를 환대합니까, 아니면 추방합니까?",
                "방금 그 말은 당신의 심장에서 나왔습니까, 아니면 검색 엔진에서 복사되었습니까?",
                "당신의 행동이 가져올 파장을 감당할 준비가 되었습니까?",
                "그 문장 뒤에 숨겨둔 서브텍스트(속마음)를 단 한 단어로 인양하십시오.",
                "당신의 목소리는 심해를 울리는 고유한 주파수입니까, 의미 없이 흩어지는 노이즈입니까?",
                "말을 아끼는 것이 지혜입니까, 아니면 책임지기 싫은 회피입니까?"
            ],
            ambiguity: [
                "'그냥'이라는 단어는 진실을 가리는 짙은 안개입니까, 사유를 포기한 비겁한 정지입니까?",
                "모른다는 답변은 지식의 부재입니까, 아니면 직면할 용기의 부재입니까?",
                "글쎄요, 라고 말할 때 당신의 뇌는 어떤 도망로를 찾고 있습니까?",
                "당신의 모호함이 누군가에게는 잔인한 고문이 될 수 있다는 것을 아십니까?",
                "송신된 신호의 농도가 수압을 견디지 못하고 흩어지고 있습니다. 단어의 입체감을 살려 다시 송신하십시오.",
                "질문의 본질을 흐리는 당신의 태도는 유연함입니까, 아니면 교활함입니까?",
                "당신의 '아마도'는 확률의 영역입니까, 아니면 책임 회피의 영역입니까?",
                "안개 속에 숨는 것이 편안하십니까? 그 안개가 걷혔을 때 드러날 초라함이 두렵지는 않습니까?",
                "의미 없는 단어의 나열은 사유의 밀도를 낮출 뿐입니다. 당신의 진심이 담긴 주파수를 고정하십시오.",
                "'그저 그렇다'는 답변은 당신의 영혼이 무채색이라는 고백입니까?"
            ],
            joy: [
                "그 기쁨의 기하학적 구조는 어떠합니까? 둥글고 부드럽습니까, 아니면 별처럼 뾰족합니까?",
                "그 환희가 당신의 피부 어디를 어떤 온도로 적셨는지 묘사하십시오.",
                "이 충만함이 당신의 과거 어떤 결핍을 보상해주고 있습니까?",
                "이 찰나의 환희가 당신의 사유에 어떤 필연적인 흔적을 남겼습니까? 당신을 정의하는 고유한 감각으로 묘사하십시오.",
                "당신의 웃음은 심해의 산소입니까, 아니면 일시적인 기포입니까?",
                "그 성취감 뒤에 찾아올 고요한 평화를 어떤 단어로 정의하시겠습니까?",
                "이 환희를 당신의 것으로 받아들이기 위해 필요한 마지막 사유는 무엇입니까?",
                "그 행복이 타인의 불행 위에서 피어난 독화(毒花)는 아닙니까?",
                "지금 이 순간의 농도를 백분율(%)로 표현한다면, 당신의 사유는 어디에 도달해 있습니까?",
                "이 보석 같은 순간을 당신의 보석함에 어떤 이름으로 저장하겠습니까?"
            ]
        }
    },
    en: {
        title: "[ Deep-Reso : The Forbidden Words ]",
        system_init: "What is the kindest thing you said to yourself today?",
        input_placeholder: "Transmit your thought...",
        res_metric: "RESOLUTION",
        status_online: "ONLINE",
        latency: "32ms",
        secure: "SECURE",
        scanning: "SCANNING... DETECTING CAMOUFLAGE...",
        res_increase: "Resolution Increased. Meaning clarified by +{val}%.",
        gem_found: ":: Resolution 100% Reached. [SBT: Soulbound Token] Minted. Your truth is permanently recorded on the immutable blockchain.",
        last_breath: "Captain, if you feel lost, it is because you are close to the truth. Breathe. Let your heart speak first.",
        guide_nudge: "Hesitation lowers thought density. Describe your current 'block' without using adjectives.",
        system_busy: ":: SIGNAL UNSTABLE. Low density response. Cannot triangulate thought coordinates.",
        signal_lost: ":: Deep sea signal weak. Connection lost. Adjust your frequency.",
        enter_key: "ENTER",
        digging_prelude: ":: DEEP DISSECTION PROTOCOL. KEYWORD: [{keyword}]",
        digging_categories: {
            fatigue: [
                "Does the weight of fatigue press on your shoulders like lead, or is it a hollow noise in your head?",
                "Where did your energy evaporate? Was it a performance for others, or abuse towards yourself?",
                "What color now fills the void of your exhausted soul?",
                "Is your current lethargy a shield protecting you, or a prison confining you?",
                "If you named your fatigue, would it be closer to 'The End' or 'A Pause'?",
                "Is it a temporary discharge fixed by sleep, or a crack leaking from deep within the soul?",
                "Is that headache resistance to truth, or indigestion from swallowing too many fake words?",
                "Do you wish for your depletion to be seen as a badge of honor by someone?",
                "Is the feeling of wanting to do nothing 'Empiness' or 'Giving Up'?",
                "What is the seascape visible only in your depleted state? Transmit that low-saturation truth."
            ],
            attitude: [
                "Is that tenderness warmth for others, or your cowardice to avoid being hated?",
                "Is your cynicism an expression of intellectual superiority, or a defense mechanism against being hurt?",
                "What is the temperature (°C) of your true face hidden behind the smooth mask of kindness?",
                "Is that belief you hold onto stubbornly your ego, or an ideology injected by others?",
                "Do you realize your honesty is becoming a sharp shell for someone else?",
                "How many truths have you killed in the name of consideration?",
                "Is that humility true lowness, or a leap to receive greater praise?",
                "Does your anger aim at justice, or towards inferiority?",
                "Is your indifferent attitude the calm of the deep sea, or necrosis from paralyzed senses?",
                "Describe the sharp fragments of yourself revealed when that tenderness shatters."
            ],
            language: [
                "Is your sentence a clear wave waking the deep sea silence, or a light bubble fleeing to the surface?",
                "Do your words heal wounds, or taxidermy the truth?",
                "Was the motive of that action your will, or a reflex created by the environment?",
                "Did you choose silence for depth of thought, or because you ran out of answers?",
                "Does your language welcome someone, or banish them?",
                "Did that word come from your heart, or was it copied from a search engine?",
                "Are you ready to bear the ripples your actions will cause?",
                "Salvage the subtext hidden behind that sentence in a single word.",
                "Is your voice a unique frequency ringing in the deep sea, or noise scattering meaninglessly?",
                "Is saving words wisdom, or avoidance of responsibility?"
            ],
            ambiguity: [
                "Is the word 'just' a thick fog hiding the truth, or a cowardly stop giving up on thought?",
                "Is 'I don't know' an absence of knowledge, or an absence of courage to face it?",
                "When you say 'Well', what escape route is your brain looking for?",
                "Do you know your ambiguity can be cruel torture to someone?",
                "The density of the transmitted signal is scattering under pressure. Transmit again with dimensional words.",
                "Is your attitude blurring the essence of the question flexibility, or cunning?",
                "Is your 'Maybe' in the realm of probability, or the realm of responsibility avoidance?",
                "Are you comfortable hiding in the fog? Do you fear the shabbiness revealed when it clears?",
                "Listing meaningless words only lowers thought density. Fix the frequency containing your sincerity.",
                "Is the answer 'It is just so' a confession that your soul is achromatic?"
            ],
            joy: [
                "What is the geometric structure of that joy? Round and soft, or sharp like a star?",
                "Describe where and at what temperature that ecstasy soaked your skin.",
                "What lack in your past is this fullness compensating for?",
                "What inevitable trace has this moment of ecstasy left on your thought? Describe it with your unique sense.",
                "Is your laughter oxygen of the deep sea, or a temporary bubble?",
                "What word would you define the quiet peace coming after that sense of accomplishment?",
                "What is the last thought needed to accept this ecstasy as yours?",
                "Is that happiness a poisonous flower blooming on someone else's misfortune?",
                "If you express the density of this moment in percentage (%), where has your thought reached?",
                "With what name will you save this gem-like moment in your Gem Box?"
            ]
        }
    }
};
