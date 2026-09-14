declare module 'soundfont-player' {
  export interface Player {
    play: (note: string | number, time?: number, options?: { duration?: number; gain?: number }) => any;
    stop: () => void;
  }

  export type InstrumentName = string;

  export function instrument(
    ac: AudioContext,
    name: InstrumentName,
    options?: { soundfont?: string; destination?: AudioNode }
  ): Promise<Player>;
}