import { Geist_Mono } from "next/font/google";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground relative overflow-hidden">
        {/* Background Ambient Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-deep-sea to-black"></div>
        
        <div className="z-10 flex flex-col items-center gap-6 text-center max-w-2xl">
            <div className="border border-terminal-dim p-8 rounded-lg bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <h1 className="text-4xl md:text-6xl font-bold text-terminal-green tracking-tighter animate-pulse">
                Hello, Deep-Reso
                </h1>
                <p className="mt-4 text-terminal-dim text-sm md:text-base">
                [SYSTEM INITIALIZED]
                <br />
                Connection established to the Sea of Thought.
                </p>
            </div>
            
            <div className="flex gap-4 mt-8 text-xs text-gray-500">
                <span>STATUS: ONLINE</span>
                <span>RES: 0%</span>
            </div>
        </div>
    </main>
  );
}
