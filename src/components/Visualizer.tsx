import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import * as Tone from 'tone';

interface VisualizerProps {
    isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const render = () => {
            if (!isPlaying) {
                // Optional: Clear or dim when paused
                ctx.fillStyle = 'rgba(0,0,0,0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Continue loop to fade out or just return? 
                // Let's continue to show silence or low activity if analyser runs
            }

            // Get frequency data
            const values = audioEngine.analyser.getValue();

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (values instanceof Float32Array) {
                const barWidth = canvas.width / values.length;

                ctx.fillStyle = '#d946ef'; // Neon Purple base

                for (let i = 0; i < values.length; i++) {
                    const value = values[i]; // -Infinity to 0 usually in dB, but Tone.Analyser("fft") returns Magnitude if "fft"? 
                    // Wait, "fft" returns dB (-100 to 0). "waveform" returns -1 to 1.
                    // For FFT, we map -100 to 0 -> 0 to height.

                    const height = Tone.dbToGain(value) * canvas.height * 4; // Scale up gain to pixel height

                    // Draw Bar
                    const x = i * barWidth;
                    const y = canvas.height - height;

                    // Gradient Fill
                    const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
                    gradient.addColorStop(0, '#d946ef');
                    gradient.addColorStop(1, '#0ea5e9');
                    ctx.fillStyle = gradient;

                    ctx.fillRect(x, y, barWidth - 2, height);

                    // Reflection effect
                    ctx.globalAlpha = 0.2;
                    ctx.fillRect(x, canvas.height, barWidth - 2, height * 0.5); // fake reflection below? needs canvas expansion.
                    ctx.globalAlpha = 1.0;
                }
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="w-full h-24 bg-dark-surface/30 backdrop-blur-sm rounded-lg border border-white/5 overflow-hidden relative">
            <canvas
                ref={canvasRef}
                width={320}
                height={100}
                className="w-full h-full"
            />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(255,0,0,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none" />
        </div>
    );
};
