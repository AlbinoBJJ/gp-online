import { Play, Pause, Square, Volume2, VolumeX, Gauge, ZoomIn, Timer, Clock, Repeat, TrendingUp } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isLoopEnabled: boolean;
  autoAccelerate: boolean;
  isMetronomeEnabled: boolean;
  isCountInEnabled: boolean;
  hasAnacrusis?: boolean;
  scoreTitle: string | null;
  scoreArtist: string | null;
  statusMessage: string;
  playbackSpeed: number;
  zoomLevel: number;
  layoutMode: string;
  onTogglePlay: () => void;
  onStopPlayback: () => void;
  onToggleMasterMute: () => void;
  onToggleLoop: () => void;
  onOpenLoopModal: () => void;
  onToggleMetronome: () => void;
  onToggleCountIn: () => void;
  onSpeedChange: (speed: number) => void;
  onZoomChange: (zoom: number) => void;
  onLayoutChange: (mode: string) => void;
}

export function Controls({
  isPlaying,
  isLoading,
  isMuted,
  isLoopEnabled,
  autoAccelerate,
  isMetronomeEnabled,
  isCountInEnabled,
  hasAnacrusis,
  scoreTitle,
  scoreArtist,
  statusMessage,
  playbackSpeed,
  zoomLevel,
  layoutMode,
  onTogglePlay,
  onStopPlayback,
  onToggleMasterMute,
  onToggleLoop,
  onOpenLoopModal,
  onToggleMetronome,
  onToggleCountIn,
  onSpeedChange,
  onZoomChange,
  onLayoutChange
}: ControlsProps) {
  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '75px',
      backgroundColor: '#1e293b',
      borderTop: '1px solid #334155',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 1000
    }}>
      <div style={{ width: '22%' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {scoreTitle || 'Selecione uma partitura'}
        </div>
        <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>
          {scoreArtist || statusMessage}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={onStopPlayback} disabled={isLoading} style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#94a3b8', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Square size={16} />
        </button>
        
        <button onClick={onTogglePlay} disabled={isLoading} style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: isPlaying ? '#ef4444' : '#10b981', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}>
          {isPlaying ? <Pause size={24} color="#fff" /> : <Play size={24} color="#0f172a" style={{ marginLeft: '3px' }} />}
        </button>

        <button onClick={onToggleMasterMute} style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: isMuted ? '#7f1d1d' : '#0f172a', color: isMuted ? '#ef4444' : '#94a3b8', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button 
          onClick={onToggleLoop} 
          style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '50%', 
            backgroundColor: isLoopEnabled ? '#10b981' : '#0f172a', 
            color: isLoopEnabled ? '#0f172a' : '#94a3b8', 
            border: '1px solid #334155', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer' 
          }}
          title="Ativar/Desativar Loop A/B"
        >
          <Repeat size={18} />
        </button>

        <button 
          onClick={onOpenLoopModal} 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px', 
            backgroundColor: '#0f172a', 
            color: autoAccelerate ? '#10b981' : '#94a3b8', 
            border: '1px solid #334155', 
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer' 
          }}
        >
          <TrendingUp size={16} />
          <span>Treino A/B</span>
        </button>

        <button onClick={onToggleMetronome} disabled={hasAnacrusis} style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: isMetronomeEnabled && !hasAnacrusis ? '#10b981' : '#0f172a', color: isMetronomeEnabled && !hasAnacrusis ? '#0f172a' : '#64748b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: hasAnacrusis ? 'not-allowed' : 'pointer' }}>
          <Timer size={18} />
        </button>

        <button onClick={onToggleCountIn} disabled={hasAnacrusis} style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: isCountInEnabled && !hasAnacrusis ? '#10b981' : '#0f172a', color: isCountInEnabled && !hasAnacrusis ? '#0f172a' : '#64748b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: hasAnacrusis ? 'not-allowed' : 'pointer' }}>
          <Clock size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '35%', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gauge size={16} color="#10b981" />
          <select value={playbackSpeed} onChange={(e) => onSpeedChange(Number(e.target.value))} style={{ backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '4px', padding: '4px 8px', fontSize: '13px' }}>
            <option value={0.5}>0.50x</option>
            <option value={0.75}>0.75x</option>
            <option value={0.9}>0.90x</option>
            <option value={1.0}>1.00x (Normal)</option>
            <option value={1.1}>1.10x</option>
            <option value={1.25}>1.25x</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ZoomIn size={16} color="#10b981" />
          <select value={zoomLevel} onChange={(e) => onZoomChange(Number(e.target.value))} style={{ backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '4px', padding: '4px 8px', fontSize: '13px' }}>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
          <button onClick={() => onLayoutChange('page')} style={{ backgroundColor: layoutMode === 'page' ? '#10b981' : 'transparent', color: layoutMode === 'page' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Página
          </button>
          <button onClick={() => onLayoutChange('horizontal')} style={{ backgroundColor: layoutMode === 'horizontal' ? '#10b981' : 'transparent', color: layoutMode === 'horizontal' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Horizontal
          </button>
        </div>
      </div>
    </footer>
  );
}