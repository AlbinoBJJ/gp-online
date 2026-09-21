import { Header } from '../components/Header';
import { PlayerCanvas } from './score-player/PlayerCanvas';
import { LoopModal } from './score-player/LoopModal';
import { TrackMixerDrawer } from './score-player/TrackMixerDrawer';
import { useScorePlayer } from './score-player/useScorePlayer';
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
  LayoutGrid,
  Disc
} from 'lucide-react';

interface ScorePlayerToolProps {
  activeTool?: 'player' | 'fretboard' | 'ear-training';
  onSelectTool?: (tool: 'player' | 'fretboard' | 'ear-training') => void;
}

export function ScorePlayerTool({ activeTool = 'player', onSelectTool }: ScorePlayerToolProps) {
  const {
    setApi,
    isPlaying,
    isLoading,
    statusMessage,
    scoreTitle,
    scoreArtist,
    anacrusisInfo,
    soundFontUrl,
    setSoundFontUrl,
    playbackSpeed,
    zoomLevel,
    layoutMode,
    tracks,
    isMuted,
    transposition,
    isLoopEnabled,
    isLoopModalOpen, setIsLoopModalOpen,
    loopStartBar, setLoopStartBar,
    loopEndBar, setLoopEndBar,
    totalBars,
    autoAccelerate, setAutoAccelerate,
    startSpeed, setStartSpeed,
    targetSpeed, setTargetSpeed,
    speedStep, setSpeedStep,
    metronomeVolumePercent,
    countInVolumePercent,
    isMixerOpen, setIsMixerOpen,
    isSettingsOpen, setIsSettingsOpen,
    visibleTrackIndexes,
    trackVolumesPercent,
    mutedTracks,
    soloTracks,
    trackStaves,
    togglePlay,
    stopPlayback,
    toggleMasterMute,
    toggleLoop,
    applyLoopSettings,
    handleSpeedChange,
    handleZoomChange,
    handleLayoutChange,
    handleTranspositionChange,
    handleMetronomeVolumeChange,
    handleCountInVolumeChange,
    toggleTrackVisibility,
    handleTrackVolumeChange,
    toggleTrackMute,
    toggleTrackSolo,
    toggleTrackStaveType,
    handleFileUpload,
    handleScoreLoaded,
    setIsPlaying,
    setIsLoading
  } = useScorePlayer();

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

        <PlayerCanvas
          soundFontUrl={soundFontUrl}
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
            title="Play / Pause (Espaço)"
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
            title="Parar (Esc)"
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
            title="Mudar Mute Master (M)"
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
            title="Ativar/Desativar Loop (L)"
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
              border: '1px solid #10b981',
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

            {/* SELETOR DE TIMBRE (SOUNDFONT) */}
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600 }}>
                  <Disc size={14} color="#10b981" />
                  Timbre do Leitor:
                </label>
                <select
                  value={soundFontUrl}
                  onChange={(e) => setSoundFontUrl(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #334155', padding: '8px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}
                >
                  <option value="https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.8.4/dist/soundfont/sonivox.sf2">
                    Timbre Padrão
                  </option>
                  <option value={`${import.meta.env.BASE_URL}soundfont/GeneralUser-GS.sf2`}>
                    Timbre melhorado
                  </option>
                </select>
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