'use client';

import React, { useState, useEffect } from 'react';
import { ResolutionGauge } from '@/components/ResolutionGauge';
import { ChatWindow } from '@/components/ChatWindow';
import { InputConsole } from '@/components/InputConsole';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { GemBox } from '@/components/GemBox';
import { ManifestoIntro } from '@/components/ManifestoIntro';
import { checkInput, calculateNewResolution } from '@/lib/gameLogic';
import { translations, Language } from '@/lib/translations';

interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
}

export default function Home() {
  const [lang, setLang] = useState<Language>('ko');
  const [resolution, setResolution] = useState(0);
  const [gems, setGems] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'system',
      content: '시스템 초기화 완료. 사유의 바다에 연결되었습니다. 현재 해상도 0%. 송신을 시작하십시오.'
    }
  ]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };

    setMessages(prev => [...prev, newMessage]);

    // Check logic
    const checkResult = checkInput(content, lang, resolution);

    if (!checkResult.isValid) {
      // Failure/Penalty case
      if (checkResult.penalty) {
        const newResolution = calculateNewResolution(resolution, -checkResult.penalty);
        setResolution(newResolution);
      }

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-sys',
          role: 'system',
          content: checkResult.message || "ERROR"
        }]);
      }, 500);
    } else {
      // Success case
      const reward = checkResult.reward || 10;
      let newResolution = calculateNewResolution(resolution, reward);

      // Determine response message
      let responseMsg = checkResult.message || translations[lang].res_increase.replace('{val}', newResolution.toString());

      // Gem Logic (100% Trigger)
      if (newResolution >= 100) {
        setGems(prev => [...prev, content]);
        newResolution = 0; // Reset for prestige loop
        responseMsg = lang === 'ko'
          ? "축하합니다. 순도 100%의 사유를 정제했습니다. 이 문장은 '보석함'에 영구 보존됩니다."
          : "Congratulations. You have distilled a thought of 100% purity. It is now preserved in the Gem Box.";
      }

      setResolution(newResolution);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-sys',
          role: 'system',
          content: responseMsg
        }]);
      }, 500);
    }
  };

  const t = translations[lang];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-foreground relative overflow-hidden transition-all duration-300">

      {showIntro && <ManifestoIntro lang={lang} onComplete={() => setShowIntro(false)} />}

      <LanguageSwitcher currentLang={lang} onToggle={setLang} />

      {/* Background Ambient Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-deep-sea to-black"></div>

      <div className="z-10 w-full flex flex-col items-center max-w-3xl gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-terminal-green tracking-widest mb-4 opacity-80 font-serif">
          {t.title}
        </h1>

        <ResolutionGauge value={resolution} lang={lang} />

        <ChatWindow messages={messages} lang={lang} />

        <InputConsole onSendMessage={handleSendMessage} lang={lang} disabled={showIntro} />

        <div className="flex gap-4 mt-4 text-[10px] text-gray-700 uppercase">
          <span>{t.status_online}</span>
          <span>{t.latency}</span>
          <span>{t.secure}</span>
        </div>
      </div>

      <GemBox gems={gems} />
    </main>
  );
}
