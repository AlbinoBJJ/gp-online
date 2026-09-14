import { useEffect, useState, type ChangeEvent } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { type AnacrusisCheckResult } from '@gp-online/core';
import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { LoopModal } from '../components/LoopModal';
import { TrackMixerDrawer } from '../components/TrackMixerDrawer';
import {
  AlertTriangle,
  Sliders,
  Upload,
  Play,
  Pause,
  Square,
  Repeat,
  Settings,
  Plus,
  Minus,
  X,
  Volume2,
  VolumeX,
  Gauge,
  LayoutGrid
} from 'lucide-react';

interface TrackStaveConfig {
  score: boolean;
  tab: boolean;
  slash: boolean;
}

interface ScorePlayerToolProps {
  activeTool?: 'player' | 'fretboard' | 'ear-training';
  onSelectTool?: (tool: 'player' | 'fretboard' | 'ear-training') => void;
}

export function ScorePlayerTool({ activeTool, onSelectTool }: ScorePlayerToolProps) {
  const [api, setApi] = useState<alphaTab.AlphaTabApi | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Pronto para carregar partitura');
  const [scoreTitle, setScoreTitle] = useState<string | null>(null);
  const [scoreArtist, setScoreArtist] = useState<string | null>(null);
  const [anacrusisInfo, setAnacrusisInfo] = useState<AnacrusisCheckResult | null>(null);

  // Controles Globais
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [layoutMode, setLayoutMode] = useState<string>('page');
  const [tracks, setTracks] = useState<alphaTab.model.Track[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [transposition, setTransposition] = useState<number>(0);

  // Loop & Treino
  const [isLoopEnabled, setIsLoopEnabled] = useState<boolean>(false);
  const [isLoopModalOpen, setIsLoopModalOpen] = useState<boolean>(false);
  const [loopStartBar, setLoopStartBar] = useState<number>(1);
  const [loopEndBar, setLoopEndBar] = useState<number>(4);
  const [totalBars, setTotalBars] = useState<number>(1);
  const [autoAccelerate, setAutoAccelerate] = useState<boolean>(false);
  const [startSpeed, setStartSpeed] = useState<number>(0.6);
  const [targetSpeed, setTargetSpeed] = useState<number>(1.0);
  const [speedStep, setSpeedStep] = useState<number>(0.05);

  // Metrônomo
  const [metronomeVolumePercent, setMetronomeVolumePercent] = useState<number>(50);
  const [countInVolumePercent, setCountInVolumePercent] = useState<number>(50);

  // Modais & Drawers
  const [isMixerOpen, setIsMixerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Pistas
  const [visibleTrackIndexes, setVisibleTrackIndexes] = useState<number[]>([]);
  const [trackVolumesPercent, setTrackVolumesPercent] = useState<{ [key: number]: number }>({});
  const [mutedTracks, setMutedTracks] = useState<{ [key: number]: boolean }>({});
  const [soloTracks, setSoloTracks] = useState<{ [key: number]: boolean }>({});
  const [trackStaves, setTrackStaves] = useState<{ [key: number]: TrackStaveConfig }>({});

  const percentToAlphaTabVolume = (percent: number): number => {
    if (percent <= 0) return 0;
    return Math.round(Math.pow(percent / 100, 2) * 16 * 10) / 10;
  };

  const alphaTabVolumeToPercent = (volume: number): number => {
    return Math.round(Math.sqrt(volume / 16) * 100);
  };

  const togglePlay = async () => {
    if (!api) return;
    await api.playPause();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [api]);

  const handleScoreLoaded = (score: alphaTab.model.Score, result: AnacrusisCheckResult) => {
    setIsLoading(false);
    setScoreTitle(score.title || 'Sem título');
    setScoreArtist(score.artist || 'Artista desconhecido');
    setStatusMessage('Partitura pronta');
    setTracks(score.tracks);

    const count = score.masterBars.length;
    setTotalBars(count);
    setLoopStartBar(1);
    setLoopEndBar(Math.min(4, count));

    const initialVisible = score.tracks.map((t) => t.index);
    const initialVolumes: { [key: number]: number } = {};
    const initialMutes: { [key: number]: boolean } = {};
    const initialSolos: { [key: number]: boolean } = {};
    const initialStaves: { [key: number]: TrackStaveConfig } = {};

    score.tracks.forEach((track) => {
      initialVolumes[track.index] = alphaTabVolumeToPercent(track.playbackInfo.volume);
      initialMutes[track.index] = track.playbackInfo.isMute;
      initialSolos[track.index] = track.playbackInfo.isSolo;
      initialStaves[track.index] = { score: true, tab: true, slash: false };
    });

    setVisibleTrackIndexes(initialVisible);
    setTrackVolumesPercent(initialVolumes);
    setMutedTracks(initialMutes);
    setSoloTracks(initialSolos);
    setTrackStaves(initialStaves);
    setAnacrusisInfo(result);

    if (api && result.hasAnacrusis) {
      api.metronomeVolume = 0;
      api.countInVolume = 0;
    }
  };

  const applyLoopSettings = () => {
    if (!api || !api.score) return;

    if (isLoopEnabled) {
      api.isLooping = true;
      const startBarIndex = Math.max(0, loopStartBar - 1);
      const endBarIndex = Math.min(api.score.masterBars.length - 1, loopEndBar - 1);

      const startTick = api.score.masterBars[startBarIndex]?.start || 0;
      const endBar = api.score.masterBars[endBarIndex];
      const endTick = endBar ? endBar.start + endBar.calculateDuration() : 0;

      api.playbackRange = { startTick, endTick };

      if (autoAccelerate) {
        setPlaybackSpeed(startSpeed);
        api.playbackSpeed = startSpeed;
      }
    } else {
      api.isLooping = false;
      api.playbackRange = null;
    }
  };

  const toggleLoop = () => {
    const nextState = !isLoopEnabled;
    setIsLoopEnabled(nextState);
    if (api) {
      api.isLooping = nextState;
      if (!nextState) {
        api.playbackRange = null;
      } else {
        applyLoopSettings();
      }
    }
  };

  const stopPlayback = () => {
    if (!api) return;
    api.stop();
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (api) api.playbackSpeed = speed;
  };

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.max(50, Math.min(200, newZoom));
    setZoomLevel(clampedZoom);
    if (api) {
      api.settings.display.scale = clampedZoom / 100;
      api.updateSettings();
      api.render();
    }
  };

  const handleLayoutChange = (mode: string) => {
    setLayoutMode(mode);
    if (!api) return;
    api.settings.display.layoutMode = mode === 'horizontal' ? alphaTab.LayoutMode.Horizontal : alphaTab.LayoutMode.Page;
    api.updateSettings();
    api.render();
  };

  const handleTranspositionChange = (semitones: number) => {
    setTransposition(semitones);
    if (!api) return;
    tracks.forEach((track) => {
      api.changeTrackTranspositionPitch([track], semitones);
    });
  };

  const toggleMasterMute = () => {
    if (!api) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    api.masterVolume = newMute ? 0 : 1.0;
  };

  const handleMetronomeVolumeChange = (percent: number) => {
    setMetronomeVolumePercent(percent);
    if (api && !anacrusisInfo?.hasAnacrusis) {
      api.metronomeVolume = percentToAlphaTabVolume(percent);
    }
  };

  const handleCountInVolumeChange = (percent: number) => {
    setCountInVolumePercent(percent);
    if (api && !anacrusisInfo?.hasAnacrusis) {
      api.countInVolume = percentToAlphaTabVolume(percent);
    }
  };

  const toggleTrackVisibility = (trackIndex: number) => {
    const isVisible = visibleTrackIndexes.includes(trackIndex);
    const newVisible = isVisible
      ? visibleTrackIndexes.filter((idx) => idx !== trackIndex)
      : [...visibleTrackIndexes, trackIndex];

    setVisibleTrackIndexes(newVisible);
    if (api) {
      const tracksToRender = tracks.filter((t) => newVisible.includes(t.index));
      api.renderTracks(tracksToRender);
    }
  };

  const handleTrackVolumeChange = (trackIndex: number, percent: number) => {
    setTrackVolumesPercent((prev) => ({ ...prev, [trackIndex]: percent }));
    if (api && tracks[trackIndex]) {
      const alphaVol = percentToAlphaTabVolume(percent);
      tracks[trackIndex].playbackInfo.volume = alphaVol;
      api.changeTrackVolume([tracks[trackIndex]], alphaVol);
    }
  };

  const toggleTrackMute = (trackIndex: number) => {
    if (!api || !tracks[trackIndex]) return;
    const nextState = !mutedTracks[trackIndex];
    setMutedTracks((prev) => ({ ...prev, [trackIndex]: nextState }));
    tracks[trackIndex].playbackInfo.isMute = nextState;
    api.changeTrackMute([tracks[trackIndex]], nextState);
  };

  const toggleTrackSolo = (trackIndex: number) => {
    if (!api || !tracks[trackIndex]) return;
    const nextState = !soloTracks[trackIndex];
    setSoloTracks((prev) => ({ ...prev, [trackIndex]: nextState }));
    tracks[trackIndex].playbackInfo.isSolo = nextState;
    api.changeTrackSolo([tracks[trackIndex]], nextState);
  };

  const toggleTrackStaveType = (trackIndex: number, type: keyof TrackStaveConfig) => {
    const current = trackStaves[trackIndex] || { score: true, tab: true, slash: false };
    const updated = { ...current, [type]: !current[type] };
    setTrackStaves((prev) => ({ ...prev, [trackIndex]: updated }));

    if (!api || !tracks[trackIndex]) return;

    tracks[trackIndex].staves.forEach((stave) => {
      stave.showStandardNotation = updated.score;
      stave.showTablature = updated.tab;
    });

    api.render();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !api) return;

    setIsLoading(true);
    setStatusMessage(`Carregando ${file.name}...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        api.load(new Uint8Array(buffer));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Header activeTool={activeTool} onSelectTool={onSelectTool}>
        <button
          onClick={() => setIsMixerOpen(true)}
          title="Abrir Mixer Multitrack"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <Sliders size={18} color="#10b981" />
        </button>

        <label
          title="Abrir arquivo de partitura"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            padding: '0 10px',
            backgroundColor: '#10b981',
            color: '#0f172a',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
            gap: '6px'
          }}
        >
          <Upload size={16} />
          <span className="desktop-only-text" style={{ fontSize: '12px' }}>Abrir</span>
          <input type="file" accept=".gp,.gpx,.gp5,.gp4,.gp3,.xml,.musicxml" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>
      </Header>

      <div style={{ paddingTop: '80px', paddingBottom: '75px', paddingLeft: '12px', paddingRight: '12px' }}>
        {scoreTitle && (
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scoreTitle}</h2>
              {scoreArtist && <span style={{ fontSize: '12px', color: '#94a3b8' }}>{scoreArtist}</span>}
            </div>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, flexShrink: 0 }}>{statusMessage}</span>
          </div>
        )}

        {anacrusisInfo?.hasAnacrusis && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fbbf24'
          }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '12px' }}>Anacruse detectada. Metrônomo automático desativado.</span>
          </div>
        )}

        <Player
          onApiReady={setApi}
          onScoreLoaded={handleScoreLoaded}
          onPlayerStateChanged={setIsPlaying}
          onRenderStatusChange={setIsLoading}
        />
      </div>

      {/* BARRA DE TRANSPORTE INFERIOR COMPACTA */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#1e293b',
        borderTop: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={togglePlay}
            disabled={isLoading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#0f172a',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={20} fill="#0f172a" /> : <Play size={20} fill="#0f172a" style={{ marginLeft: '2px' }} />}
          </button>

          <button
            onClick={stopPlayback}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Square size={14} />
          </button>

          <button
            onClick={toggleMasterMute}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              backgroundColor: isMuted ? '#ef4444' : '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleLoop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '6px',
              backgroundColor: isLoopEnabled ? '#10b981' : '#0f172a',
              color: isLoopEnabled ? '#0f172a' : '#94a3b8',
              border: '1px solid #334155',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <Repeat size={14} />
            <span>Loop</span>
          </button>

          {isLoopEnabled && (
            <button
              onClick={() => setIsLoopModalOpen(true)}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                color: '#10b981',
                border: '1px solid #10b981',
                fontWeight: 700,
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              C.{loopStartBar}-{loopEndBar}
            </button>
          )}

          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Ajustes da Partitura"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              backgroundColor: '#0f172a',
              color: '#10b981',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* DRAWER LATERAL DE CONFIGURAÇÕES */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex' }}>
          <div style={{ width: '300px', height: '100%', backgroundColor: '#1e293b', borderRight: '1px solid #334155', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings size={16} color="#10b981" />
                Ajustes da Partitura
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Tom (Transposição):</label>
              <select
                value={transposition}
                onChange={(e) => handleTranspositionChange(Number(e.target.value))}
                style={{ width: '100%', backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #334155', padding: '8px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}
              >
                <option value={-6}>-6 Semitons</option>
                <option value={-3}>-3 Semitons</option>
                <option value={0}>Tom Original (0)</option>
                <option value={3}>+3 Semitons</option>
                <option value={6}>+6 Semitons</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 }}>
                <Gauge size={14} color="#10b981" />
                Velocidade ({Math.round(playbackSpeed * 100)}%):
              </label>
              <input
                type="range"
                min={0.25}
                max={2.0}
                step={0.05}
                value={playbackSpeed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Zoom Visual:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '6px', border: '1px solid #334155' }}>
                <button
                  onClick={() => handleZoomChange(zoomLevel - 10)}
                  style={{ flex: 1, padding: '6px', backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', minWidth: '40px', textAlign: 'center' }}>
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => handleZoomChange(zoomLevel + 10)}
                  style={{ flex: 1, padding: '6px', backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 }}>
                <LayoutGrid size={14} color="#10b981" />
                Modo de Visualização:
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleLayoutChange('page')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    backgroundColor: layoutMode === 'page' ? '#10b981' : '#0f172a',
                    color: layoutMode === 'page' ? '#0f172a' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Página
                </button>
                <button
                  onClick={() => handleLayoutChange('horizontal')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    backgroundColor: layoutMode === 'horizontal' ? '#10b981' : '#0f172a',
                    color: layoutMode === 'horizontal' ? '#0f172a' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Horizontal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoopModal
        isOpen={isLoopModalOpen}
        loopStartBar={loopStartBar}
        loopEndBar={loopEndBar}
        totalBars={totalBars}
        autoAccelerate={autoAccelerate}
        startSpeed={startSpeed}
        targetSpeed={targetSpeed}
        speedStep={speedStep}
        onClose={() => setIsLoopModalOpen(false)}
        onLoopStartBarChange={setLoopStartBar}
        onLoopEndBarChange={setLoopEndBar}
        onAutoAccelerateChange={setAutoAccelerate}
        onStartSpeedChange={setStartSpeed}
        onTargetSpeedChange={setTargetSpeed}
        onSpeedStepChange={setSpeedStep}
        onApply={() => {
          applyLoopSettings();
          setIsLoopModalOpen(false);
        }}
      />

      <TrackMixerDrawer
        isOpen={isMixerOpen}
        tracks={tracks}
        visibleTrackIndexes={visibleTrackIndexes}
        trackVolumesPercent={trackVolumesPercent}
        mutedTracks={mutedTracks}
        soloTracks={soloTracks}
        trackStaves={trackStaves}
        metronomeVolumePercent={metronomeVolumePercent}
        countInVolumePercent={countInVolumePercent}
        hasAnacrusis={anacrusisInfo?.hasAnacrusis}
        onClose={() => setIsMixerOpen(false)}
        onMetronomeVolumeChange={handleMetronomeVolumeChange}
        onCountInVolumeChange={handleCountInVolumeChange}
        onToggleTrackVisibility={toggleTrackVisibility}
        onToggleTrackMute={toggleTrackMute}
        onToggleTrackSolo={toggleTrackSolo}
        onToggleTrackStaveType={toggleTrackStaveType}
        onTrackVolumeChange={handleTrackVolumeChange}
      />
    </div>
  );
}