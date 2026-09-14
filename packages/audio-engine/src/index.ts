export * from './types';
export * from './AudioEngine';

import { AudioEngine } from './AudioEngine';

export const playAudioNote = (midi: number, instrument: string, duration?: number) => {
  AudioEngine.getInstance().playNote(midi, instrument, duration);
};

export const loadAudioInstrument = (instrument: string) => {
  return AudioEngine.getInstance().loadInstrument(instrument);
};