import * as Tone from 'tone';

class AudioEngine {
    private kick: Tone.MembraneSynth;
    private snare: Tone.NoiseSynth;
    private hihat: Tone.MetalSynth;
    private clap: Tone.PolySynth;

    // Mixer Channels (Volume, Pan, Mute, Solo)
    private channels: Tone.Channel[];
    private finalLimiter: Tone.Limiter;
    public analyser: Tone.Analyser;

    constructor() {
        this.finalLimiter = new Tone.Limiter(-10).toDestination();
        this.analyser = new Tone.Analyser("fft", 32); // Low resolution for retro look
        this.finalLimiter.connect(this.analyser);
        // Initialize Channels for each track
        // Channel handles Volume, Pan, Mute, Solo internally in Tone.js
        this.channels = Array.from({ length: 4 }).map(() =>
            new Tone.Channel({ volume: 0, pan: 0 }).connect(this.finalLimiter)
        );

        // Kick
        this.kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 10,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
        }).connect(this.channels[0]);

        // Snare
        this.snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
        }).connect(this.channels[1]);

        // HiHat (Fixed parameters)
        // MetalSynth connects to channel
        this.hihat = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5,
        }).connect(this.channels[2]);

        // Clap
        this.clap = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sawtooth' },
            envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
        }).connect(this.channels[3]);

        // Initial Levels
        this.channels[0].volume.value = 0;   // Kick
        this.channels[1].volume.value = -5;  // Snare
        this.channels[2].volume.value = -15; // HiHat
        this.channels[3].volume.value = -10; // Clap
    }

    async initialize() {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        console.log("Audio Engine Initialized");
    }

    playTrack(trackIndex: number, time: number) {
        if (this.channels[trackIndex].mute) return; // Tone.Channel doesn't stop trigger, just audio, but good optimization

        switch (trackIndex) {
            case 0: // Kick
                this.kick.triggerAttackRelease("C1", "8n", time);
                break;
            case 1: // Snare
                this.snare.triggerAttackRelease("8n", time);
                break;
            case 2: // HiHat - FIX: Trigger with frequency/note
                // MetalSynth expects frequency/note as first arg sometimes, or we can just trigger envelope
                // Using high frequency for HiHat sound
                this.hihat.triggerAttackRelease("32n", time, 0.3); // "32n" is duration? No wait. 
                // Correct usage for MetalSynth often involves just triggerAttackRelease without note if it's noise-based, 
                // BUT MetalSynth is pitched. Let's pass a frequency or note.
                // Documentation says: triggerAttackRelease(note, duration, time, velocity)
                // Let's use a frequency like 200Hz or similar that sounds metallic
                // Or "C4" if harmonicity takes care of it.
                // Based on issues, let's try explicit frequency.
                // Actually, just passing duration as first arg depends on overload.
                // Safer:
                this.hihat.triggerAttackRelease(200, "32n", time, 1);
                break;
            case 3: // Clap
                this.clap.triggerAttackRelease(["C4", "E4"], "16n", time);
                break;
        }
    }

    // Mixer Controls
    setVolume(trackIndex: number, db: number) {
        this.channels[trackIndex].volume.rampTo(db, 0.1);
    }

    setMute(trackIndex: number, muted: boolean) {
        this.channels[trackIndex].mute = muted;
    }

    setSolo(trackIndex: number, soloed: boolean) {
        this.channels[trackIndex].solo = soloed;
    }

    setBpm(bpm: number) {
        Tone.Transport.bpm.value = bpm;
    }

    start() {
        if (Tone.Transport.state !== 'started') {
            Tone.Transport.start();
        }
    }

    stop() {
        Tone.Transport.stop();
    }

    // Analyser hook possibility
    // We can return destination or analyser node if needed for visualizer
    getDestination() {
        return this.finalLimiter;
    }
}

export const audioEngine = new AudioEngine();
