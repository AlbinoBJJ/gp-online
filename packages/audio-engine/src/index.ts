export * from './types';
export * from './AudioEngine';

import { AudioEngine } from './AudioEngine';

export const playAudioNote = (midi: number, instrument: string, duration?: number, allowPolyphony?: boolean) => {
  AudioEngine.getInstance().playNote(midi, instrument, duration ?? 2.0, allowPolyphony ?? true);
};

export const loadAudioInstrument = (instrument: string) => {
  return AudioEngine.getInstance().loadInstrument(instrument);
};