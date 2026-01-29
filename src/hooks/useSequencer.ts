import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { audioEngine } from '../audio/AudioEngine';

export const STEPS = 16;
export const TRACKS = 4; // Kick, Snare, HiHat, Clap

// Initial Pattern: Empty
const initialGrid = Array(TRACKS).fill(null).map(() => Array(STEPS).fill(false));


interface TrackSettings {
    volume: number; // in dB, range -60 to +6
    mute: boolean;
    solo: boolean;
}

const initialTrackSettings: TrackSettings[] = Array(TRACKS).fill(null).map((_, i) => ({
    volume: i === 2 ? -15 : (i === 1 ? -5 : (i === 3 ? -10 : 0)), // Match AudioEngine defaults
    mute: false,
    solo: false
}));

export const useSequencer = () => {
    const [grid, setGrid] = useState<boolean[][]>(initialGrid);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [bpm, setBpm] = useState(120);
    const [trackSettings, setTrackSettings] = useState<TrackSettings[]>(initialTrackSettings);

    // Refs for access inside Tone loop
    const gridRef = useRef(grid);

    useEffect(() => {
        gridRef.current = grid;
    }, [grid]);

    useEffect(() => {
        const loop = new Tone.Sequence(
            (time, step) => {
                // Update current step for UI
                Tone.Draw.schedule(() => {
                    setCurrentStep(step);
                }, time);

                // Trigger sounds based on grid
                gridRef.current.forEach((track, trackIndex) => {
                    if (track[step]) {
                        audioEngine.playTrack(trackIndex, time);
                    }
                });
            },
            Array.from({ length: STEPS }, (_, i) => i), // [0, 1, ... 15]
            "16n"
        );

        loop.start(0);

        return () => {
            loop.dispose();
        };
    }, []);

    useEffect(() => {
        audioEngine.setBpm(bpm);
    }, [bpm]);

    // Update AudioEngine when track settings change
    useEffect(() => {
        trackSettings.forEach((setting, index) => {
            audioEngine.setVolume(index, setting.volume);
            audioEngine.setMute(index, setting.mute);
            audioEngine.setSolo(index, setting.solo);
        });
    }, [trackSettings]);

    const toggleStep = async (trackIndex: number, stepIndex: number) => {
        const newGrid = grid.map((track, i) =>
            i === trackIndex
                ? track.map((active, j) => (j === stepIndex ? !active : active))
                : track
        );
        setGrid(newGrid);

        // Preview sound if activating
        if (!grid[trackIndex][stepIndex]) {
            if (Tone.Transport.state !== 'started') {
                await audioEngine.initialize();
            }
            // Temporarily unmute if muted to hear preview? Maybe not.
            audioEngine.playTrack(trackIndex, Tone.now());
        }
    };

    const clearGrid = () => {
        setGrid(initialGrid);
    };

    const togglePlay = async () => {
        if (!isPlaying) {
            await audioEngine.initialize();
            audioEngine.start();
        } else {
            audioEngine.stop();
        }
        setIsPlaying(!isPlaying);
    };

    // Mixer Handlers
    const setTrackVolume = (index: number, val: number) => {
        setTrackSettings(prev => prev.map((s, i) => i === index ? { ...s, volume: val } : s));
    };

    const toggleTrackMute = (index: number) => {
        setTrackSettings(prev => prev.map((s, i) => i === index ? { ...s, mute: !s.mute } : s));
    };

    const toggleTrackSolo = (index: number) => {
        setTrackSettings(prev => prev.map((s, i) => i === index ? { ...s, solo: !s.solo } : s));
    };

    return {
        grid,
        setGrid,
        currentStep,
        isPlaying,
        togglePlay,
        bpm,
        setBpm,
        toggleStep,
        clearGrid,
        trackSettings,
        setTrackVolume,
        toggleTrackMute,
        toggleTrackSolo
    };
};
