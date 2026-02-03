import React, { useEffect, useRef } from 'react';

interface Message {
    id: string;
    role: 'user' | 'system';
    content: string;
}

interface ChatWindowProps {
    messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={scrollRef}
            className="w-full max-w-3xl h-[60vh] overflow-y-auto bg-black/80 border border-gray-800 p-4 font-mono shadow-inner mb-2 custom-scrollbar"
        >
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                    <p>NO DATA DETECTED</p>
                    <p className="text-xs mt-2">Begin transmission...</p>
                </div>
            )}

            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[80%] p-3 text-sm md:text-base border-l-2 leading-relaxed
            ${msg.role === 'user'
                                ? 'border-terminal-green bg-terminal-green/5 text-foreground'
                                : 'border-terminal-dim bg-gray-900/50 text-terminal-green'
                            }`}
                    >
                        <span className="block text-[10px] opacity-50 mb-1 uppercase tracking-widest">
                            {msg.role === 'user' ? '>> PILOT' : ':: SYSTEM'}
                        </span>
                        {msg.content}
                    </div>
                </div>
            ))}
        </div>
    );
}
