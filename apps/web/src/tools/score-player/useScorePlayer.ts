import { useState, useEffect, type ChangeEvent } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { type AnacrusisCheckResult } from '@gp-online/core';

export interface TrackStaveConfig {
  score: boolean;
  tab: boolean;
  slash: boolean;
}

export function useScorePlayer() {
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

  // Metrônomo Auxiliar
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

  const stopPlayback = () => {
    if (!api) return;
    api.stop();
  };

  const toggleMasterMute = () => {
    if (!api) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    api.masterVolume = newMute ? 0 : 1.0;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (api) api.playbackSpeed = speed;
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

  // Mapeamento Global de Atalhos de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          e.preventDefault();
          stopPlayback();
          break;
        case 'KeyL':
          e.preventDefault();
          toggleLoop();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMasterMute();
          break;
        case 'Equal':
        case 'NumpadAdd':
          e.preventDefault();
          handleSpeedChange(Math.min(2.0, Math.round((playbackSpeed + 0.05) * 100) / 100));
          break;
        case 'Minus':
        case 'NumpadSubtract':
          e.preventDefault();
          handleSpeedChange(Math.max(0.25, Math.round((playbackSpeed - 0.05) * 100) / 100));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [api, playbackSpeed, isLoopEnabled, isMuted]);

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

  return {
    setApi,
    isPlaying,
    isLoading,
    statusMessage,
    scoreTitle,
    scoreArtist,
    anacrusisInfo,
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
  };
}