'use client';

import React, { useState, useEffect } from 'react';
import { ResolutionGauge } from '@/components/ResolutionGauge';
import { ChatWindow } from '@/components/ChatWindow';
import { InputConsole } from '@/components/InputConsole';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { GemBox } from '@/components/GemBox';
import { ManifestoIntro } from '@/components/ManifestoIntro';
import { GlitchText } from '@/components/GlitchText';
import { checkInput, calculateNewResolution } from '@/lib/gameLogic';
import { translations, Language } from '@/lib/translations';

interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
  isGlitch?: boolean;
}

export default function Home() {
  const [lang, setLang] = useState<Language>('ko');
  const [resolution, setResolution] = useState(0);
  const [gems, setGems] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  // Anti-Repetition Queue (v3.1)
  const [recentTemplates, setRecentTemplates] = useState<string[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'system',
      content: translations['ko'].system_init
    }
  ]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'init-1') {
      setMessages([{
        id: 'init-1',
        role: 'system',
        content: translations[lang].system_init
      }]);
    }
  }, [lang]);

  // Guide Nudge Timer (15s inactivity)
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'system' && !showIntro) {
      const timer = setTimeout(() => {
        setMessages(prev => {
          // Prevent duplicate nudges
          if (prev.length > 0 &&
            prev[prev.length - 1].role === 'system' &&
            prev[prev.length - 1].content === translations[lang].guide_nudge) {
            return prev;
          }
          return [...prev, {
            id: Date.now().toString() + '-nudge',
            role: 'system',
            content: translations[lang].guide_nudge,
            isGlitch: false
          }];
        });
      }, 15000); // 15s
      return () => clearTimeout(timer);
    }
  }, [messages, lang, showIntro]);

  const handleSendMessage = (content: string) => {
    // 1. User Message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    setMessages(prev => [...prev, newMessage]);
    setIsScanning(true);

    // 2. Logic Check
    setTimeout(() => {
      // Updated checkInput with recentTemplates (v3.1)
      const checkResult = checkInput(content, lang, resolution, recentTemplates);
      setIsScanning(false);

      if (!checkResult.isValid) {
        // FAILURE
        const newFailCount = consecutiveFailures + 1;
        setConsecutiveFailures(newFailCount);

        if (checkResult.penalty) {
          const newRes = calculateNewResolution(resolution, -checkResult.penalty);
          setResolution(newRes);
        }

        if (newFailCount >= 3) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now().toString() + '-sys-rescue',
              role: 'system',
              content: translations[lang].last_breath,
              isGlitch: false
            }]);
            setConsecutiveFailures(0);
          }, 800);
        } else {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now().toString() + '-sys',
              role: 'system',
              content: checkResult.message || "ERROR",
              isGlitch: checkResult.isGlitch
            }]);
          }, 500);
        }

      } else {
        // SUCCESS
        setConsecutiveFailures(0);

        // Update Anti-Repetition Queue
        if (checkResult.usedQuestionId) {
          setRecentTemplates(prev => {
            const newQueue = [...prev, checkResult.usedQuestionId!];
            if (newQueue.length > 5) newQueue.shift(); // Keep last 5
            return newQueue;
          });
        }

        const reward = checkResult.reward || 10;
        let newResolution = calculateNewResolution(resolution, reward);
        let responseMsg = "";

        if (newResolution >= 100) {
          setGems(prev => [...prev, content]);
          newResolution = 0;
          responseMsg = translations[lang].gem_found;
        } else if (newResolution === 98) {
          responseMsg = lang === 'ko'
            ? "마지막 안개 한 겹이 남았습니다. 당신의 진심을 단 한 방울만 더 보태십시오."
            : "One final layer of fog remains. Add just one more drop of truth.";
        } else if (checkResult.diggingMessage) {
          // Digging Engine Triggered
          responseMsg = checkResult.diggingMessage;
        } else {
          responseMsg = checkResult.message || translations[lang].res_increase.replace('{val}', newResolution.toString());
        }

        setResolution(newResolution);

        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + '-sys',
            role: 'system',
            content: responseMsg,
            isGlitch: !!checkResult.isGlitch || !!checkResult.diggingMessage
          }]);
        }, 500);
      }
    }, 1200);
  };

  const t = translations[lang];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-foreground relative overflow-hidden font-serif">

      {showIntro && <ManifestoIntro lang={lang} onComplete={() => setShowIntro(false)} />}

      <LanguageSwitcher currentLang={lang} onToggle={setLang} />

      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-deep-sea to-black"></div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 animate-deep-pulse bg-[url('/noise.png')]"></div>
      <div className="fixed inset-0 pointer-events-none z-[50] opacity-5 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] animate-scanline"></div>

      <div className="z-10 w-full flex flex-col items-center max-w-3xl gap-6">

        <h1 className="text-xl md:text-3xl font-bold text-terminal-green tracking-widest mb-2 opacity-90 font-serif text-center">
          <GlitchText text={t.title} intensity="medium" />
        </h1>

        <ResolutionGauge value={resolution} lang={lang} />

        <ChatWindow messages={messages} lang={lang} />

        <div className={`h-6 text-xs font-mono text-alert-red tracking-widest transition-opacity duration-300 ${isScanning ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
          {t.scanning}
        </div>

        <InputConsole onSendMessage={handleSendMessage} lang={lang} disabled={showIntro || isScanning} />

        <div className="flex gap-4 mt-4 text-[10px] text-gray-600 uppercase font-mono">
          <span>{t.status_online}</span>
          <span>{t.latency}</span>
          <span>{t.secure}</span>
          <span className={resolution < 30 ? "text-alert-red animate-pulse" : "text-terminal-dim"}>
            SIGNAL_STABILITY: {Math.max(0, 100 - resolution)}%
          </span>
        </div>
      </div>

      <GemBox gems={gems} />
    </main>
  );
}
