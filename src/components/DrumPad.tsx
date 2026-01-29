import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DrumPadProps {
    active: boolean;
    isCurrentStep: boolean;
    trackIndex: number;
    onClick: () => void;
}

const trackColors = [
    'bg-neon-purple shadow-neon-purple', // Kick
    'bg-neon-blue shadow-neon-blue',     // Snare
    'bg-neon-green shadow-neon-green',   // HiHat
    'bg-yellow-400 shadow-yellow-400'    // Clap
];

export const DrumPad: React.FC<DrumPadProps> = ({ active, isCurrentStep, trackIndex, onClick }) => {
    const colorClass = trackColors[trackIndex % trackColors.length]; // Fallback for safety

    return (
        <motion.button
            onClick={onClick}
            className={twMerge(
                "w-8 h-12 md:w-10 md:h-14 rounded-sm border border-gray-800 transition-all duration-75 relative overflow-hidden",
                active ? "bg-opacity-80" : "bg-opacity-10 bg-gray-800",
                active && colorClass,
                isCurrentStep ? "border-white" : "border-gray-800"
            )}
            animate={{
                scale: isCurrentStep && active ? 1.1 : 1,
                borderColor: isCurrentStep ? "#ffffff" : "#1f2937", // gray-800
                boxShadow: isCurrentStep && active
                    ? `0 0 15px ${active ? 'currentColor' : 'transparent'}`
                    : "none"
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
        >
            {/* LED Indicator inside */}
            {active && (
                <div className={clsx(
                    "absolute inset-0 opacity-50",
                    colorClass.split(' ')[0] // Just the bg class
                )} />
            )}

            {/* Current Step Overlay */}
            {isCurrentStep && (
                <div className="absolute inset-0 bg-white opacity-20" />
            )}
        </motion.button>
    );
};
