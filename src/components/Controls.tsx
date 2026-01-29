import React from 'react';
import { Play, Square, Trash2, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsProps {
    isPlaying: boolean;
    bpm: number;
    onTogglePlay: () => void;
    onBpmChange: (bpm: number) => void;
    onClear: () => void;
    onLoadPreset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
    isPlaying,
    bpm,
    onTogglePlay,
    onBpmChange,
    onClear,
    onLoadPreset
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-dark-surface/80 rounded-xl border border-white/10 backdrop-blur-md w-full max-w-4xl shadow-lg">

            {/* Play/Stop Main Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTogglePlay}
                className={`
          flex items-center justify-center w-16 h-16 rounded-full border-2 
          transition-all duration-200 shadow-[0_0_20px_rgba(0,0,0,0.3)]
          ${isPlaying
                        ? 'bg-red-500/20 border-red-500 text-red-500 shadow-red-500/20'
                        : 'bg-neon-green/20 border-neon-green text-neon-green shadow-neon-green/20'
                    }
        `}
            >
                {isPlaying ? <Square fill="currentColor" size={24} /> : <Play fill="currentColor" size={28} className="ml-1" />}
            </motion.button>

            {/* BPM Slider */}
            <div className="flex-1 w-full flex flex-col gap-2">
                <div className="flex justify-between text-xs font-cyber text-gray-400">
                    <span>TEMPO</span>
                    <span className="text-neon-blue font-bold text-lg">{bpm} BPM</span>
                </div>
                <input
                    type="range"
                    min="60"
                    max="240"
                    value={bpm}
                    onChange={(e) => onBpmChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue hover:accent-neon-purple transition-all"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLoadPreset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-purple/10 border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/20 transition-colors font-cyber text-sm"
                >
                    <Wand2 size={16} />
                    <span>DEMO</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClear}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition-colors font-cyber text-sm"
                >
                    <Trash2 size={16} />
                    <span>CLEAR</span>
                </motion.button>
            </div>
        </div>
    );
};
