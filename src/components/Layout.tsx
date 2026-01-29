import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-bg text-white relative selection:bg-neon-purple selection:text-white font-sans">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-dark-bg to-dark-bg pointer-events-none" />
            <div className="scanline" />

            {/* Content */}
            <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen gap-8">
                <header className="text-center space-y-2 mb-4">
                    <h1 className="text-4xl md:text-6xl font-cyber font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue animate-pulse-fast drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                        NEON BEATS
                    </h1>
                    <p className="text-gray-400 font-cyber text-xs md:text-sm tracking-[0.2em] uppercase">
                        Cyberpunk Drum Sequencer
                    </p>
                </header>

                {children}

                <footer className="mt-auto text-gray-600 text-xs font-cyber py-4">
                    POWERED BY TONE.JS & REACT
                </footer>
            </main>
        </div>
    );
};
