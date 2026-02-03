'use client';

import React, { useState, useEffect } from 'react';
import { ResolutionGauge } from '@/components/ResolutionGauge';
import { ChatWindow } from '@/components/ChatWindow';
import { InputConsole } from '@/components/InputConsole';
import { checkInput, calculateResolutionIncrease } from '@/lib/gameLogic';

interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
}

export default function Home() {
  const [resolution, setResolution] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'system',
      content: 'System initialized. Connection established to the Sea of Thought. Resolution at 0%. Begin transmission.'
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
    const checkResult = checkInput(content);

    if (!checkResult.isValid) {
      // Failure case
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-sys',
          role: 'system',
          content: checkResult.message || "ERROR"
        }]);
      }, 500);
    } else {
      // Success case
      const newResolution = calculateResolutionIncrease(resolution);
      setResolution(newResolution);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-sys',
          role: 'system',
          content: `Resolution increased to ${newResolution}%. Continue deeper.`
        }]);
      }, 500);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-foreground relative overflow-hidden">
      {/* Background Ambient Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-deep-sea to-black"></div>

      <div className="z-10 w-full flex flex-col items-center max-w-3xl gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-terminal-green tracking-widest mb-4 opacity-80">
          DEEP_RESO_PROTOCOL
        </h1>

        <ResolutionGauge value={resolution} />

        <ChatWindow messages={messages} />

        <InputConsole onSendMessage={handleSendMessage} />

        <div className="flex gap-4 mt-4 text-[10px] text-gray-700 uppercase">
          <span>System: ONLINE</span>
          <span>Latency: 12ms</span>
          <span>Secure: YES</span>
        </div>
      </div>
    </main>
  );
}
