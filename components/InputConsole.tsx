'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';

interface InputConsoleProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export function InputConsole({ onSendMessage, disabled }: InputConsoleProps) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on load and after submit
    useEffect(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [disabled]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;

        onSendMessage(input);
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mt-4 relative">
            <div className="flex items-center bg-black border border-terminal-dim p-3 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-colors focus-within:border-terminal-green">
                <span className="text-terminal-green mr-3 animate-pulse">❯</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={disabled}
                    className="flex-1 bg-transparent text-foreground outline-none font-mono placeholder-gray-700 disabled:opacity-50"
                    placeholder={disabled ? "SYSTEM_BUSY..." : "Input command..."}
                    autoComplete="off"
                />
                <div className="absolute right-3 top-3 text-[10px] text-gray-600 border border-gray-800 px-1">
                    ENTER
                </div>
            </div>
        </form>
    );
}
