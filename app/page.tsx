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
import { calculatePoDR, mintSBT, getRewardMessage } from '@/lib/podr';
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

  const handleSendMessage = async (content: string) => {
    // 1. User Message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    setMessages(prev => [...prev, newMessage]);
    setIsScanning(true);

    // AI / Local Logic
    try {
      // Minimum visual delay for "Thinking" effect
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1500));

      // API Call Promise - We catch errors HERE to prevent Unhandled Rejection
      const apiPromise = fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, lang })
      }).then(async res => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      }).catch(err => {
        return { error: true, details: err };
      });

      // Wait for both
      const [_, aiResult] = await Promise.all([minDelayPromise, apiPromise]);

      setIsScanning(false);

      if (aiResult && !aiResult.error && aiResult.resolution_score !== undefined) {
        // === AI SUCCESS PATH ===
        const aiData = aiResult;
        const newRes = aiData.resolution_score;

        // Resolution Logic based on AI Score
        // If AI score is high, boost resolution. If low, drop it.
        let resChange = 0;
        if (newRes < 30) resChange = -5;
        else if (newRes < 50) resChange = 0;
        else if (newRes < 80) resChange = 10;
        else resChange = 15;

        const nextResolution = calculateNewResolution(resolution, resChange);
        setResolution(nextResolution);

        // 3-Line Format Construction
        const line1 = `${aiData.analysis_signal} ${aiData.dissection_phrase}`;
        const line2 = `"${aiData.deep_question}"`;
        const line3 = aiData.action_prompt || "다시 송신하십시오.";

        const responseContent = `${line1}\n${line2}\n${line3}`;

        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + '-sys-ai',
            role: 'system',
            content: responseContent,
            // Glitch if resolution is low (warning)
            isGlitch: newRes < 30
          }]);
        }, 300);

        // Gem Logic / PoDR Protocol
        if (nextResolution >= 100) {
          setTimeout(async () => {
            setGems(prev => [...prev, content]);
            setResolution(0);

            // Trigger PoDR Minting Simulation
            const podr = calculatePoDR(100);
            const sbtData = await mintSBT(content);

            // 1. System Nudge
            setMessages(prev => [...prev, {
              id: Date.now().toString() + '-gem',
              role: 'system',
              content: translations[lang].gem_found + `\n\n[TX_HASH]: ${sbtData.txHash}\n[TOKEN_ID]: ${sbtData.tokenId}`,
              isGlitch: false
            }]);

            // 2. Token Mining Feedback
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: Date.now().toString() + '-mining',
                role: 'system',
                content: getRewardMessage(podr),
                isGlitch: true
              }]);
            }, 1000);

          }, 1200);
        }

      } else {
        // === FAILURE / FALLBACK PATH ===
        console.warn("AI Failed, triggering fallback/interference.", aiResult?.details);

        // User requested: ":: 통신 주파수 간섭 발생. 잠항을 일시 중단합니다."
        // AND we also have the v3.1 Local Engine.
        // Strategy: Show the Interference message, then run Local Logic to keep the game alive?
        // Or just show interference and stop?
        // "잠항을 일시 중단합니다" implies stop. But that's bad UX if it happens often (e.g. no key).
        // I will show the Interference Message, but then *also* provide a Local Logic response after a short delay,
        // creating a "Re-routing..." effect.

        const interferenceMsg = translations[lang].signal_lost;

        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-err',
          role: 'system',
          content: interferenceMsg,
          isGlitch: true
        }]);

        // Trigger Local Logic after 1s
        setTimeout(() => {
          const checkResult = checkInput(content, lang, resolution, recentTemplates);

          // ... (Local Logic Code) ...
          // Reusing the local logic block structure logic essentially

          // Just calling the logic handler directly or replicating here?
          // Replicating for clarity in this snippet.

          let localResponse = "";
          let isGlitch = checkResult.isGlitch;

          if (!checkResult.isValid) {
            // Local Failure
            const newFailCount = consecutiveFailures + 1;
            setConsecutiveFailures(newFailCount);

            if (checkResult.penalty) {
              setResolution(prev => calculateNewResolution(prev, -checkResult.penalty!));
            }

            if (newFailCount >= 3) {
              localResponse = translations[lang].last_breath;
              setConsecutiveFailures(0);
            } else {
              localResponse = checkResult.message || "ERROR";
            }
          } else {
            // Local Success
            setConsecutiveFailures(0);
            if (checkResult.usedQuestionId) {
              setRecentTemplates(prev => {
                const newQueue = [...prev, checkResult.usedQuestionId!];
                if (newQueue.length > 5) newQueue.shift();
                return newQueue;
              });
            }

            const reward = checkResult.reward || 10;
            const newResolution = calculateNewResolution(resolution, reward);
            setResolution(newResolution);

            if (newResolution >= 100) {
              setGems(prev => [...prev, content]);
              setResolution(0); // Reset resolution after gem
              localResponse = translations[lang].gem_found;
            } else if (newResolution === 98) {
              localResponse = lang === 'ko'
                ? "마지막 안개 한 겹이 남았습니다. 당신의 진심을 단 한 방울만 더 보태십시오."
                : "One final layer of fog remains. Add just one more drop of truth.";
            } else if (checkResult.diggingMessage) {
              localResponse = checkResult.diggingMessage;
            } else {
              localResponse = checkResult.message || translations[lang].res_increase.replace('{val}', newResolution.toString());
            }
          }

          setMessages(prev => [...prev, {
            id: Date.now().toString() + '-sys-local',
            role: 'system',
            content: localResponse,
            isGlitch: !!isGlitch || !!checkResult.diggingMessage
          }]);

        }, 1500);
      }

    } catch (err) {
      console.error("Critical Error", err);
      setIsScanning(false);
    }
  };

  const t = translations[lang];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-foreground relative overflow-hidden font-serif">

      {showIntro ? (
        <ManifestoIntro lang={lang} onComplete={() => setShowIntro(false)} />
      ) : (
        <>
          <LanguageSwitcher currentLang={lang} onToggle={setLang} />

          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-deep-sea to-black"></div>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-10 animate-deep-pulse bg-[url('/noise.svg')]"></div>
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

            <InputConsole onSendMessage={handleSendMessage} lang={lang} disabled={isScanning} />

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
        </>
      )}
    </main>
  );
}
