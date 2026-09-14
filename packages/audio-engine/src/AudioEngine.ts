import Soundfont from 'soundfont-player';
import type { InstrumentPreset } from './types';

export const DEFAULT_INSTRUMENTS: InstrumentPreset[] = [
  { id: 'steel_guitar', label: 'Violão de Aço Real', soundfontName: 'acoustic_guitar_steel' },
  { id: 'clean_guitar', label: 'Guitarra Elétrica Clean', soundfontName: 'electric_guitar_clean' },
  { id: 'bass_finger', label: 'Baixo Elétrico', soundfontName: 'electric_bass_finger' },
  { id: 'grand_piano', label: 'Piano de Cauda Real', soundfontName: 'acoustic_grand_piano' },
  { id: 'violin', label: 'Violino', soundfontName: 'violin' }
];

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private audioCtx: AudioContext | null = null;
  private loadedInstruments: Map<string, Soundfont.Player> = new Map();
  private loadingPromises: Map<string, Promise<Soundfont.Player>> = new Map();

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Pré-carrega um instrumento para resposta instantânea ao tocar
   */
  public async loadInstrument(soundfontName: string): Promise<Soundfont.Player> {
    if (this.loadedInstruments.has(soundfontName)) {
      return this.loadedInstruments.get(soundfontName)!;
    }

    if (this.loadingPromises.has(soundfontName)) {
      return this.loadingPromises.get(soundfontName)!;
    }

    const ctx = this.getAudioContext();
    const loadPromise = Soundfont.instrument(ctx, soundfontName as Soundfont.InstrumentName, {
      soundfont: 'MusyngKite'
    }).then((player) => {
      this.loadedInstruments.set(soundfontName, player);
      this.loadingPromises.delete(soundfontName);
      return player;
    }).catch((err) => {
      this.loadingPromises.delete(soundfontName);
      console.error(`[AudioEngine] Erro ao carregar timbre (${soundfontName}):`, err);
      throw err;
    });

    this.loadingPromises.set(soundfontName, loadPromise);
    return loadPromise;
  }

  /**
   * Executa uma nota MIDI com o instrumento selecionado
   */
  public playNote(midiNumber: number, soundfontName: string = 'acoustic_guitar_steel', duration: number = 2.0) {
    const player = this.loadedInstruments.get(soundfontName);
    const noteString = String(midiNumber);

    if (player) {
      player.play(noteString, undefined, { duration });
    } else {
      this.loadInstrument(soundfontName).then((p) => {
        p.play(noteString, undefined, { duration });
      });
    }
  }
}