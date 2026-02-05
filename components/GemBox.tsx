import React, { useState } from 'react';

import { Answer_Asset } from '@/lib/podr';

interface GemBoxProps {
    gems: Answer_Asset[];
}

export function GemBox({ gems }: GemBoxProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-deep-sea border border-terminal-green shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-110 transition-transform group"
            >
                <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">💎</span>

                {gems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-alert-red text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {gems.length}
                    </span>
                )}
            </button>

            {/* Modal/Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-deep-sea border border-terminal-green/50 rounded-xl p-6 max-h-[80vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-terminal-dim hover:text-white"
                        >
                            CLOSE [X]
                        </button>

                        <h2 className="text-xl font-serif text-terminal-green mb-6 border-b border-terminal-green/30 pb-2">
                            The Gem Box (보석함)
                        </h2>

                        {gems.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 font-mono text-sm">
                                <p>No gems collected yet.</p>
                                <p className="mt-2">Reach 100% resolution to crystallize your thoughts.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {gems.map((gem, idx) => (
                                    <div key={gem.id || idx} className="p-4 bg-black/50 border border-t-yellow-500/30 border-b-blue-500/30 border-x-transparent rounded-lg relative overflow-hidden group hover:border-terminal-green/50 transition-colors">
                                        <div className="absolute top-2 right-2 text-xs text-yellow-500/50 group-hover:text-yellow-400 font-mono">
                                            GEM #{idx + 1}
                                        </div>
                                        <p className="text-gray-200 font-serif leading-relaxed pr-6 italic">
                                            "{gem.content}"
                                        </p>
                                        {gem.txHash && (
                                            <div className="mt-2 text-[10px] text-gray-600 font-mono">
                                                TX: {gem.txHash.substring(0, 10)}...{gem.txHash.substring(gem.txHash.length - 6)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
