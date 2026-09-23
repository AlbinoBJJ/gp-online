import { useState } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { type TrackStaveConfig } from './types';

export function useScorePlayerTracks(api: alphaTab.AlphaTabApi | null, tracks: alphaTab.model.Track[]) {
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

  const initializeTracks = (loadedTracks: alphaTab.model.Track[]) => {
    const initialVisible = loadedTracks.map((t) => t.index);
    const initialVolumes: { [key: number]: number } = {};
    const initialMutes: { [key: number]: boolean } = {};
    const initialSolos: { [key: number]: boolean } = {};
    const initialStaves: { [key: number]: TrackStaveConfig } = {};

    loadedTracks.forEach((track) => {
      // 1. Configurações de playback (volumes, mutes, solos)
      initialVolumes[track.index] = alphaTabVolumeToPercent(track.playbackInfo.volume);
      initialMutes[track.index] = track.playbackInfo.isMute;
      initialSolos[track.index] = track.playbackInfo.isSolo;

      // 2. Leitura segura e robusta das pautas do AlphaTab
      const firstStave = track.staves && track.staves[0];
      
      // Verificamos explicitamente o valor booleano ou assumimos true se a pauta possuir notas/tablatura ativa
      let showScore = true;
      let showTab = true;

      if (firstStave) {
        // O AlphaTab armazena a visibilidade; tratamos indefinições como true por segurança, 
        // mas respeitando caso venha explicitamente false.
        showScore = firstStave.showStandardNotation !== false;
        showTab = firstStave.showTablature !== false;
      }

      initialStaves[track.index] = { 
        score: showScore, 
        tab: showTab, 
        slash: false 
      };

      // 3. Força o AlphaTab a sincronizar perfeitamente com o estado inicial apurado
      if (track.staves) {
        track.staves.forEach((stave) => {
          stave.showStandardNotation = showScore;
          stave.showTablature = showTab;
        });
      }
    });

    setVisibleTrackIndexes(initialVisible);
    setTrackVolumesPercent(initialVolumes);
    setMutedTracks(initialMutes);
    setSoloTracks(initialSolos);
    setTrackStaves(initialStaves);
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

    const hasAtLeastOneActive = updated.score || updated.tab || updated.slash;
    if (!hasAtLeastOneActive) {
      return; 
    }

    setTrackStaves((prev) => ({ ...prev, [trackIndex]: updated }));

    if (!api || !tracks[trackIndex]) return;

    tracks[trackIndex].staves.forEach((stave) => {
      stave.showStandardNotation = updated.score;
      stave.showTablature = updated.tab;
    });

    api.render();
  };

  return {
    visibleTrackIndexes,
    trackVolumesPercent,
    mutedTracks,
    soloTracks,
    trackStaves,
    initializeTracks,
    toggleTrackVisibility,
    handleTrackVolumeChange,
    toggleTrackMute,
    toggleTrackSolo,
    toggleTrackStaveType
  };
}