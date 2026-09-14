declare module 'fretboard' {
  export interface Dot {
    note?: string;
    text?: string;
    fill?: string;
    fontColor?: string;
    fret?: number;
    string?: number;
    [key: string]: any;
  }

  export interface FretboardOptions {
    el: HTMLElement | string;
    frets?: number;
    tuning?: string | string[];
    fretWidth?: number;
    fretColor?: string;
    stringWidth?: number | number[];
    stringColor?: string;
    nutColor?: string;
    nutWidth?: number;
    font?: string;
    [key: string]: any;
  }

  export class Fretboard {
    constructor(options: FretboardOptions);
    render(): void;
    setDots(dots: Dot[]): this;
    clear(): this;
  }

  const FretboardDefault: typeof Fretboard;
  export default FretboardDefault;
}