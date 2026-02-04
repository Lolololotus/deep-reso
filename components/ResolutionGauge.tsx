import React, { useEffect, useState } from 'react';
import { translations, Language } from '@/lib/translations';

interface ResolutionGaugeProps {
    value: number; // 0 to 100
    lang: Language;
}

export function ResolutionGauge({ value, lang }: ResolutionGaugeProps) {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));
    const [isGlitching, setIsGlitching] = useState(false);

    // Trigger glitch effect on significant value changes
    useEffect(() => {
        setIsGlitching(true);
        const timer = setTimeout(() => setIsGlitching(false), 300);
        return () => clearTimeout(timer);
    }, [clampedValue]);

    // Deep Sea Color Logic
    // Low: Dark Blue/Grey (Murky)
    // Mid: Cyan/Green (Bioluminescence)
    // High: Pure White/Bright Cyan (Reaching the Core/Truth)

    let barColor = 'bg-cyan-900';
    let glowColor = 'shadow-cyan-900/50';

    if (clampedValue >= 90) {
        barColor = 'bg-white shadow-[0_0_20px_5px_rgba(255,255,255,0.8)] mix-blend-screen';
        glowColor = 'shadow-white/80';
    } else if (clampedValue >= 50) {
        barColor = 'bg-cyan-400';
        glowColor = 'shadow-cyan-400/50';
    } else if (clampedValue >= 20) {
        barColor = 'bg-cyan-700';
        glowColor = 'shadow-cyan-700/50';
    }

    return (
        <div className={`w-full max-w-3xl mb-6 font-mono transition-transform duration-100 ${isGlitching ? 'translate-x-[1px] translate-y-[-1px] opacity-90' : ''}`}>
            <div className="flex justify-between text-xs md:text-sm text-cyan-500/80 mb-1 tracking-widest">
                <span className={isGlitching ? "text-red-500" : ""}>{translations[lang].res_metric}</span>
                <span className="tabular-nums">{clampedValue.toFixed(1)}%</span>
            </div>

            {/* Gauge Container */}
            <div className="relative h-6 w-full bg-black/60 border border-cyan-900/50 overflow-hidden backdrop-blur-sm rounded-sm">

                {/* Background Grid (Depth) */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_95%,rgba(0,255,255,0.05)_95%)] bg-[length:2%_100%]"></div>

                {/* The Bar */}
                <div
                    className={`h-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${barColor} ${glowColor} shadow-[0_0_15px_0px] relative`}
                    style={{ width: `${clampedValue}%` }}
                >
                    {/* Scanner Line Effect */}
                    <div className="absolute top-0 right-0 w-[2px] h-full bg-white/80 blur-[1px]"></div>

                    {/* Inner Texture */}
                    <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)] opacity-50"></div>
                </div>

                {/* Glitch Overlay (Conditional) */}
                {isGlitching && (
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay z-10 pointer-events-none animate-pulse"></div>
                )}
            </div>

            {/* Status Text / Flavor */}
            <div className="flex justify-between mt-1 text-[10px] text-cyan-900 uppercase">
                <span>Depth: {10000 - (clampedValue * 100)}m</span>
                <span>$PoDR Protocol: Active</span>
            </div>
        </div>
    );
}
