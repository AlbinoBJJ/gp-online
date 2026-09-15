import { useState, useEffect, type ChangeEvent } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { type AnacrusisCheckResult } from '@gp-online/core';
import { useScorePlayerLoop } from './useScorePlayerLoop';
import { useScorePlayerTracks } from './useScorePlayerTracks';

export function useScorePlayer() {
  const [api, setApi] = useState<alphaTab.AlphaTabApi | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Pronto para carregar partitura');
  const [scoreTitle, setScoreTitle] = useState<string | null>(null);
  const [scoreArtist, setScoreArtist] = useState<string | null>(null);
  const [anacrusisInfo, setAnacrusisInfo] = useState<AnacrusisCheckResult | null>(null);

  // SoundFont URL State
  const [soundFontUrl, setSoundFontUrl] = useState<string>(
    `${import.meta.env.BASE_URL}soundfont/GeneralUser-GS.sf2`
  );

  // Controles Globais
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [layoutMode, setLayoutMode] = useState<string>('page');
  const [tracks, setTracks] = useState<alphaTab.model.Track[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [transposition, setTransposition] = useState<number>(0);

  // Metrônomo Auxiliar
  const [metronomeVolumePercent, setMetronomeVolumePercent] = useState<number>(50);
  const [countInVolumePercent, setCountInVolumePercent] = useState<number>(50);

  // Modais & Drawers
  const [isMixerOpen, setIsMixerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Hooks Especializados
  const loopManager = useScorePlayerLoop(api, setPlaybackSpeed);
  const trackManager = useScorePlayerTracks(api, tracks);

  const percentToAlphaTabVolume = (percent: number): number => {
    if (percent <= 0) return 0;
    return Math.round(Math.pow(percent / 100, 2) * 16 * 10) / 10;
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
          loopManager.toggleLoop();
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
  }, [api, playbackSpeed, loopManager.isLoopEnabled, isMuted]);

  const handleScoreLoaded = (score: alphaTab.model.Score, result: AnacrusisCheckResult) => {
    setIsLoading(false);
    setScoreTitle(score.title || 'Sem título');
    setScoreArtist(score.artist || 'Artista desconhecido');
    setStatusMessage('Partitura pronta');
    setTracks(score.tracks);

    const count = score.masterBars.length;
    loopManager.setTotalBars(count);
    loopManager.setLoopStartBar(1);
    loopManager.setLoopEndBar(Math.min(4, count));

    trackManager.initializeTracks(score.tracks);
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
    soundFontUrl,
    setSoundFontUrl,
    playbackSpeed,
    zoomLevel,
    layoutMode,
    tracks,
    isMuted,
    transposition,
    isLoopEnabled: loopManager.isLoopEnabled,
    isLoopModalOpen: loopManager.isLoopModalOpen,
    setIsLoopModalOpen: loopManager.setIsLoopModalOpen,
    loopStartBar: loopManager.loopStartBar,
    setLoopStartBar: loopManager.setLoopStartBar,
    loopEndBar: loopManager.loopEndBar,
    setLoopEndBar: loopManager.setLoopEndBar,
    totalBars: loopManager.totalBars,
    autoAccelerate: loopManager.autoAccelerate,
    setAutoAccelerate: loopManager.setAutoAccelerate,
    startSpeed: loopManager.startSpeed,
    setStartSpeed: loopManager.setStartSpeed,
    targetSpeed: loopManager.targetSpeed,
    setTargetSpeed: loopManager.setTargetSpeed,
    speedStep: loopManager.speedStep,
    setSpeedStep: loopManager.setSpeedStep,
    metronomeVolumePercent,
    countInVolumePercent,
    isMixerOpen, setIsMixerOpen,
    isSettingsOpen, setIsSettingsOpen,
    visibleTrackIndexes: trackManager.visibleTrackIndexes,
    trackVolumesPercent: trackManager.trackVolumesPercent,
    mutedTracks: trackManager.mutedTracks,
    soloTracks: trackManager.soloTracks,
    trackStaves: trackManager.trackStaves,
    togglePlay,
    stopPlayback,
    toggleMasterMute,
    toggleLoop: loopManager.toggleLoop,
    applyLoopSettings: loopManager.applyLoopSettings,
    handleSpeedChange,
    handleZoomChange,
    handleLayoutChange,
    handleTranspositionChange,
    handleMetronomeVolumeChange,
    handleCountInVolumeChange,
    toggleTrackVisibility: trackManager.toggleTrackVisibility,
    handleTrackVolumeChange: trackManager.handleTrackVolumeChange,
    toggleTrackMute: trackManager.toggleTrackMute,
    toggleTrackSolo: trackManager.toggleTrackSolo,
    toggleTrackStaveType: trackManager.toggleTrackStaveType,
    handleFileUpload,
    handleScoreLoaded,
    setIsPlaying,
    setIsLoading
  };
}