import React, { useEffect, useRef } from 'react';
import { translations, Language } from '@/lib/translations';
import { GlitchText } from './GlitchText';

interface Message {
    id: string;
    role: 'user' | 'system';
    content: string;
    isGlitch?: boolean;
}

interface ChatWindowProps {
    messages: Message[];
    lang: Language;
}

export function ChatWindow({ messages, lang }: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const t = translations[lang];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={scrollRef}
            className="w-full h-[400px] bg-black/50 border border-terminal-green/30 rounded-lg p-4 overflow-y-auto font-serif scrollbar-hide backdrop-blur-sm shadow-inner"
        >
            <div className="flex flex-col gap-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50 font-mono">
                        <p>NO SIGNAL</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-md text-sm md:text-base leading-relaxed ${msg.role === 'user'
                                    ? 'bg-deep-sea border border-terminal-dim/50 text-gray-200'
                                    : 'bg-transparent text-terminal-green'
                                }`}
                        >
                            {msg.role === 'system' && <span className="mr-2 opacity-50 font-mono text-xs">::</span>}

                            {msg.isGlitch ? (
                                <GlitchText text={msg.content} intensity="high" className="text-alert-red" />
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
