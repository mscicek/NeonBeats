import React from 'react';
import { DrumPad } from './DrumPad';
import { Volume2 } from 'lucide-react';

interface TrackRowProps {
    trackIndex: number;
    name: string;
    steps: boolean[];
    currentStep: number;
    volume: number;
    muted: boolean;
    soloed: boolean;
    onToggleStep: (stepIndex: number) => void;
    onVolumeChange: (val: number) => void;
    onToggleMute: () => void;
    onToggleSolo: () => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
    trackIndex,
    name,
    steps,
    currentStep,
    volume,
    muted,
    soloed,
    onToggleStep,
    onVolumeChange,
    onToggleMute,
    onToggleSolo
}) => {
    return (
        <div className="flex items-center gap-4 bg-dark-bg/50 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors w-max md:min-w-full">

            {/* Track Controls (Left) */}
            <div className="flex flex-col gap-2 w-32 md:w-40 shrink-0 border-r border-white/10 pr-4">
                <div className="flex justify-between items-center">
                    <span className="font-cyber font-bold text-gray-200 tracking-wider text-sm">{name}</span>
                    <div className="flex gap-1">
                        <button
                            onClick={onToggleMute}
                            className={`p-1.5 rounded text-xs font-bold transition-all ${muted ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Mute"
                        >
                            {muted ? 'M' : 'M'}
                        </button>
                        <button
                            onClick={onToggleSolo}
                            className={`p-1.5 rounded text-xs font-bold transition-all ${soloed ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Solo"
                        >
                            S
                        </button>
                    </div>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                    <Volume2 size={12} className="text-gray-500" />
                    <input
                        type="range"
                        min="-60"
                        max="0"
                        value={volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                    />
                </div>
            </div>

            {/* Sequencer Steps (Right) */}
            <div className="grid grid-cols-16 gap-1 md:gap-1.5">
                {steps.map((isActive, stepIndex) => (
                    <DrumPad
                        key={`${trackIndex}-${stepIndex}`}
                        trackIndex={trackIndex}
                        active={isActive}
                        isCurrentStep={currentStep === stepIndex}
                        onClick={() => onToggleStep(stepIndex)}
                    />
                ))}
            </div>
        </div>
    );
};
