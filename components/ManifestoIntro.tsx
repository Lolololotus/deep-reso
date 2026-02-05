import React, { useState, useEffect, useMemo } from 'react';

interface ManifestoIntroProps {
    onComplete: () => void;
    lang: 'en' | 'ko';
}

const CONTENT_KO = [
    "세상은 소음으로 가득 차 있습니다.",
    "타인의 목소리에 잠식된...",
    "당신의 사유를 안개 속에 두지 마십시오.",
    "이제 심해의 정적 속에서, 진짜 당신을 인양하십시오."
];

const CONTENT_EN = [
    "The world is full of noise.",
    "Your thoughts are drowned by others.",
    "Do not leave your mind in the fog.",
    "Now, in the silence of the deep... Salvage your true self."
];

export function ManifestoIntro({ onComplete, lang }: ManifestoIntroProps) {
    const [step, setStep] = useState(0);
    const [displayedText, setDisplayedText] = useState("");

    const content = lang === 'ko' ? CONTENT_KO : CONTENT_EN;

    useEffect(() => {
        if (step >= content.length) return;

        let currentText = "";
        const targetText = content[step];
        let charIndex = 0;

        // Reset text for new step
        setDisplayedText("");

        // Typing effect
        const timer = setInterval(() => {
            if (charIndex < targetText.length) {
                currentText += targetText[charIndex];
                setDisplayedText(currentText);
                charIndex++;
            } else {
                clearInterval(timer);
                // Auto advance after short delay, unless it's the last step
                if (step < content.length - 1) {
                    setTimeout(() => setStep(prev => prev + 1), 1500);
                }
            }
        }, 50); // Speed

        return () => clearInterval(timer);
    }, [step, lang, content]);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-xl font-serif text-lg md:text-2xl leading-relaxed text-gray-300 min-h-[100px]">
                {displayedText}
                <span className="animate-pulse inline-block w-2 h-5 bg-terminal-green ml-1 align-middle"></span>
            </div>

            {step === content.length - 1 && (
                <button
                    onClick={onComplete}
                    className="mt-12 px-8 py-3 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-500 tracking-widest text-sm md:text-base animate-in fade-in zoom-in duration-1000"
                >
                    {lang === 'ko' ? "[ 잠항 개시 ]" : "[ INITIATE DIVE ]"}
                </button>
            )}
        </div>
    );
}

