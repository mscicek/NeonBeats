import React from 'react';
import { TrackRow } from './TrackRow';

interface SequencerGridProps {
    grid: boolean[][];
    currentStep: number;
    trackSettings: { volume: number; mute: boolean; solo: boolean }[];
    toggleStep: (trackIndex: number, stepIndex: number) => void;
    onVolumeChange: (trackIndex: number, val: number) => void;
    onToggleMute: (trackIndex: number) => void;
    onToggleSolo: (trackIndex: number) => void;
}

const trackNames = ["KICK", "SNARE", "HIHAT", "CLAP"];

export const SequencerGrid: React.FC<SequencerGridProps> = ({
    grid,
    currentStep,
    trackSettings,
    toggleStep,
    onVolumeChange,
    onToggleMute,
    onToggleSolo
}) => {
    return (
        <div className="flex flex-col gap-2 p-4 bg-dark-surface/50 rounded-xl border border-white/5 backdrop-blur-sm shadow-2xl w-full max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px] flex flex-col gap-2">
                {grid.map((track, trackIndex) => (
                    <TrackRow
                        key={trackIndex}
                        trackIndex={trackIndex}
                        name={trackNames[trackIndex]}
                        steps={track}
                        currentStep={currentStep}
                        volume={trackSettings[trackIndex].volume}
                        muted={trackSettings[trackIndex].mute}
                        soloed={trackSettings[trackIndex].solo}
                        onToggleStep={(stepIndex) => toggleStep(trackIndex, stepIndex)}
                        onVolumeChange={(val) => onVolumeChange(trackIndex, val)}
                        onToggleMute={() => onToggleMute(trackIndex)}
                        onToggleSolo={() => onToggleSolo(trackIndex)}
                    />
                ))}

                {/* Step Indicators */}
                <div className="flex items-center gap-4 mt-1 pl-[176px] pr-1"> {/* Padding left to match TrackRow control width roughly */}
                    <div className="grid grid-cols-16 gap-1 md:gap-1.5 flex-1 w-full">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`h-1 rounded-full ${i % 4 === 0 ? 'bg-white/20' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
