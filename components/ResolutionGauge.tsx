import React from 'react';

interface ResolutionGaugeProps {
    value: number; // 0 to 100
}

export function ResolutionGauge({ value }: ResolutionGaugeProps) {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    // Color logic: Changes as resolution increases
    const barColor = clampedValue < 30 ? 'bg-red-500' : clampedValue < 70 ? 'bg-yellow-500' : 'bg-terminal-green';
    const glowColor = clampedValue < 30 ? 'shadow-red-500/50' : clampedValue < 70 ? 'shadow-yellow-500/50' : 'shadow-terminal-green/50';

    return (
        <div className="w-full max-w-3xl mb-6 font-mono">
            <div className="flex justify-between text-xs md:text-sm text-terminal-dim mb-1">
                <span>RESOLUTION_METRIC</span>
                <span>{clampedValue.toFixed(1)}%</span>
            </div>
            <div className="relative h-4 w-full bg-gray-900 border border-gray-700 overflow-hidden">
                {/* Grid lines background */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_98%,rgba(0,255,0,0.1)_98%)] bg-[length:10%_100%]"></div>

                {/* The Bar */}
                <div
                    className={`h-full transition-all duration-700 ease-out ${barColor} shadow-[0_0_10px_0px] ${glowColor}`}
                    style={{ width: `${clampedValue}%` }}
                >
                    <div className="h-full w-full bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
                </div>
            </div>
        </div>
    );
}
