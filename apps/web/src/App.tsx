import { useState } from 'react';
import { ScorePlayerTool } from './tools/ScorePlayerTool';
import { FretboardTool } from './tools/FretboardTool';
import { EarTrainingTool } from './tools/EarTrainingTool';

export function App() {
  const [activeTool, setActiveTool] = useState<'player' | 'fretboard' | 'ear-training'>('player');

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100vw', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {activeTool === 'player' && (
        <ScorePlayerTool activeTool={activeTool} onSelectTool={setActiveTool} />
      )}
      {activeTool === 'fretboard' && (
        <FretboardTool activeTool={activeTool} onSelectTool={setActiveTool} />
      )}
      {activeTool === 'ear-training' && (
        <EarTrainingTool activeTool={activeTool} onSelectTool={setActiveTool} />
      )}
    </div>
  );
}

export default App;