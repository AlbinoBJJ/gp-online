import * as alphaTab from '@coderline/alphatab';
import { Eye, FileText, Hash, Volume2, X } from 'lucide-react';
import { type TrackStaveConfig } from './types';

interface TrackMixerDrawerProps {
  isOpen: boolean;
  tracks: alphaTab.model.Track[];
  visibleTrackIndexes: number[];
  trackVolumesPercent: { [key: number]: number };
  mutedTracks: { [key: number]: boolean };
  soloTracks: { [key: number]: boolean };
  trackStaves: { [key: number]: TrackStaveConfig };
  metronomeVolumePercent: number;
  countInVolumePercent: number;
  hasAnacrusis?: boolean;
  onClose: () => void;
  onMetronomeVolumeChange: (percent: number) => void;
  onCountInVolumeChange: (percent: number) => void;
  onToggleTrackVisibility: (index: number) => void;
  onToggleTrackMute: (index: number) => void;
  onToggleTrackSolo: (index: number) => void;
  onToggleTrackStaveType: (index: number, type: keyof TrackStaveConfig) => void;
  onTrackVolumeChange: (index: number, percent: number) => void;
}

export function TrackMixerDrawer({
  isOpen,
  tracks,
  visibleTrackIndexes,
  trackVolumesPercent,
  mutedTracks,
  soloTracks,
  trackStaves,
  metronomeVolumePercent,
  countInVolumePercent,
  hasAnacrusis,
  onClose,
  onMetronomeVolumeChange,
  onCountInVolumeChange,
  onToggleTrackVisibility,
  onToggleTrackMute,
  onToggleTrackSolo,
  onToggleTrackStaveType,
  onTrackVolumeChange
}: TrackMixerDrawerProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'flex-end', zIndex: 2000 }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '460px', backgroundColor: '#1e293b', height: '100%', padding: '24px', boxShadow: '-4px 0 20px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Mixer Multitrack</h3>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Seção de Ajuste Fino de Volumes Auxiliares */}
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '12px' }}>Volumes de Áudio Auxiliar</div>
            
            {/* Metrônomo */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Volume Metrônomo</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>{metronomeVolumePercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={metronomeVolumePercent} 
                disabled={hasAnacrusis}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                onChange={(e) => onMetronomeVolumeChange(Number(e.target.value))} 
              />
            </div>

            {/* Count-In */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Volume Count-In</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>{countInVolumePercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={countInVolumePercent} 
                disabled={hasAnacrusis}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                onChange={(e) => onCountInVolumeChange(Number(e.target.value))} 
              />
            </div>
          </div>

          {/* Controle Individual de Pistas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Controle Individual de Pistas</div>
            {tracks.map((track) => {
              const staves = trackStaves[track.index] || { score: true, tab: true, slash: false };
              const isVisible = visibleTrackIndexes.includes(track.index);

              return (
                <div key={track.index} style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => onToggleTrackVisibility(track.index)} style={{ backgroundColor: isVisible ? '#10b981' : '#1e293b', color: isVisible ? '#0f172a' : '#64748b', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Eye size={16} />
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.name || `Pista ${track.index + 1}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => onToggleTrackMute(track.index)} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '4px', border: '1px solid #334155', backgroundColor: mutedTracks[track.index] ? '#ef4444' : '#1e293b', color: mutedTracks[track.index] ? '#ffffff' : '#94a3b8', cursor: 'pointer' }}>MUTE</button>
                      <button onClick={() => onToggleTrackSolo(track.index)} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '4px', border: '1px solid #334155', backgroundColor: soloTracks[track.index] ? '#eab308' : '#1e293b', color: soloTracks[track.index] ? '#0f172a' : '#94a3b8', cursor: 'pointer' }}>SOLO</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button onClick={() => onToggleTrackStaveType(track.index, 'score')} style={{ flex: 1, padding: '4px 6px', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #334155', backgroundColor: staves.score ? '#10b981' : '#1e293b', color: staves.score ? '#0f172a' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <FileText size={12} /> Pauta
                    </button>
                    <button onClick={() => onToggleTrackStaveType(track.index, 'tab')} style={{ flex: 1, padding: '4px 6px', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #334155', backgroundColor: staves.tab ? '#10b981' : '#1e293b', color: staves.tab ? '#0f172a' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Hash size={12} /> Tab
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Volume2 size={16} color="#94a3b8" />
                    <input type="range" min="0" max="100" step="1" value={trackVolumesPercent[track.index] ?? 100} onChange={(e) => onTrackVolumeChange(track.index, Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }} />
                    <span style={{ fontSize: '12px', color: '#10b981', width: '36px', textAlign: 'right', fontWeight: 600 }}>{trackVolumesPercent[track.index] ?? 100}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}