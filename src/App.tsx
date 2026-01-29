import { useSequencer, STEPS } from './hooks/useSequencer';
import { Layout } from './components/Layout';
import { SequencerGrid } from './components/SequencerGrid';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';

function App() {
  const {
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
  } = useSequencer();

  const loadDemoPreset = () => {
    // Basic House/Techno Beat
    const newGrid = grid.map((_, trackIndex) => {
      // Create new array for row
      const newRow = Array(STEPS).fill(false);

      if (trackIndex === 0) { // Kick (4-on-the-floor)
        [0, 4, 8, 12].forEach(i => newRow[i] = true);
      } else if (trackIndex === 1) { // Snare (Simple Backbeat)
        [4, 12].forEach(i => newRow[i] = true);
      } else if (trackIndex === 2) { // HiHat (Off-beat)
        [2, 6, 10, 14].forEach(i => newRow[i] = true);
      } else if (trackIndex === 3) { // Clap (Occasional)
        [12].forEach(i => newRow[i] = true);
      }

      return newRow;
    });
    setGrid(newGrid);
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl flex flex-col gap-8 items-center animate-in fade-in zoom-in duration-500">
        <Visualizer isPlaying={isPlaying} />

        <Controls
          isPlaying={isPlaying}
          bpm={bpm}
          onTogglePlay={togglePlay}
          onBpmChange={setBpm}
          onClear={clearGrid}
          onLoadPreset={loadDemoPreset}
        />

        <SequencerGrid
          grid={grid}
          currentStep={currentStep}
          trackSettings={trackSettings}
          toggleStep={toggleStep}
          onVolumeChange={setTrackVolume}
          onToggleMute={toggleTrackMute}
          onToggleSolo={toggleTrackSolo}
        />
      </div>
    </Layout>
  );
}

export default App;
