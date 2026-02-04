import React from 'react';

interface GlitchTextProps {
    text: string;
    as?: 'h1' | 'h2' | 'p' | 'span';
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({ text, as: Component = 'span', className = '', intensity = 'medium' }: GlitchTextProps) {
    return (
        <Component className={`relative inline-block group ${className}`}>
            <span className="relative z-10">{text}</span>

            {/* Glitch Layer 1 (Red/Cyan Offset) */}
            <span
                className={`absolute top-0 left-0 -z-10 w-full h-full text-alert-red opacity-70 animate-glitch-1 block ${intensity === 'high' ? 'block' : ''}`}
                aria-hidden="true"
            >
                {text}
            </span>

            {/* Glitch Layer 2 (Blue/Magenta Offset) */}
            <span
                className={`absolute top-0 left-0 -z-10 w-full h-full text-terminal-green opacity-70 animate-glitch-2 block ${intensity === 'high' ? 'block' : ''}`}
                aria-hidden="true"
            >
                {text}
            </span>
        </Component>
    );
}
