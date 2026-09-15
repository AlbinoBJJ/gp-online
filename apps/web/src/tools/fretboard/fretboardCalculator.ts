import { Scale, Note, Interval } from '@tonaljs/tonal';
import { DEFAULT_INSTRUMENTS } from '@gp-online/audio-engine';

export const CHROMATIC_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const CHROMATIC_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
export const STANDARD_TUNING = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];

export const DEFAULT_TUNINGS: { [key: number]: string[] } = {
  4: ['G2', 'D2', 'A1', 'E1'],             // Baixo 4 cordas (Corda 1: G2 a mais aguda)
  5: ['G2', 'D2', 'A1', 'E1', 'B0'],       // Baixo 5 cordas (Corda 1: G3 a mais aguda)
  6: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'], // Violão / Guitarra Padrão 6 cordas (Corda 1: E4)
  7: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2', 'B1'] // Guitarra 7 cordas (Corda 1: E4)
};

export interface ScaleTheoryInfo {
  name: string;
  formula: string[];
  notes: string[];
  description: string;
  usage: string;
}

export interface FretDot {
  id: string; // ex: "s-6-f-3"
  stringNum: number;
  fretNum: number;
  noteName: string;
  degreeText: string;
  intervalCode: string;
  color: string;
  isRoot: boolean;
  midi: number;
}

export const INSTRUMENT_SOUNDS = DEFAULT_INSTRUMENTS.map((inst) => ({
  label: inst.label,
  value: inst.soundfontName
}));

export const INTERVAL_COLORS: { [key: string]: { bg: string; text: string; label: string } } = {
  '1P': { bg: '#10b981', text: '#0f172a', label: 'T (Tônica)' },
  '2m': { bg: '#f43f5e', text: '#ffffff', label: '2m (Segunda Menor)' },
  '2M': { bg: '#fb7185', text: '#0f172a', label: '2M (Segunda Maior)' },
  '3m': { bg: '#38bdf8', text: '#0f172a', label: '3m (Terça Menor)' },
  '3M': { bg: '#0284c7', text: '#ffffff', label: '3M (Terça Maior)' },
  '4P': { bg: '#a855f7', text: '#ffffff', label: '4J (Quarta Justa)' },
  '4A': { bg: '#f59e0b', text: '#0f172a', label: '4# / 5b (Tritono)' },
  '5d': { bg: '#f59e0b', text: '#0f172a', label: '5b (Quinta Diminuta)' },
  '5P': { bg: '#6366f1', text: '#ffffff', label: '5J (Quinta Justa)' },
  '6m': { bg: '#ec4899', text: '#ffffff', label: '6m (Sexta Menor)' },
  '6M': { bg: '#db2777', text: '#ffffff', label: '6M (Sexta Maior)' },
  '7m': { bg: '#eab308', text: '#0f172a', label: '7m (Sétima Menor)' },
  '7M': { bg: '#ca8a04', text: '#ffffff', label: '7M (Sétima Maior)' },
};

export const SCALE_GROUPS = [
  {
    category: 'Modos Gregos (Por Ordem de Brilho)',
    items: [
      { label: 'Lídio (Brilho Máximo - 4#)', value: 'lydian' },
      { label: 'Jônio (Escala Maior Natural)', value: 'major' },
      { label: 'Mixolídio (Maior com 7m)', value: 'mixolydian' },
      { label: 'Dório (Menor Sofisticado - 6M)', value: 'dorian' },
      { label: 'Eólio (Escala Menor Natural)', value: 'minor' },
      { label: 'Frígio (Menor Flamenco - 2m)', value: 'phrygian' },
      { label: 'Lócrio (Tensão Máxima - 5b/2m)', value: 'locrian' }
    ]
  },
  {
    category: 'Pentatônicas & Blues',
    items: [
      { label: 'Pentatônica Maior', value: 'major pentatonic' },
      { label: 'Pentatônica Menor', value: 'minor pentatonic' },
      { label: 'Escala Blues', value: 'blues' }
    ]
  },
  {
    category: 'Escalas Menores Especiais',
    items: [
      { label: 'Menor Harmônica', value: 'harmonic minor' },
      { label: 'Menor Melódica', value: 'melodic minor' }
    ]
  }
];

export const SCALE_DESCRIPTIONS: { [key: string]: { description: string; usage: string } } = {
  lydian: {
    description: 'Modo mais brilhante de todos. Maior com 4ª Aumentada (4#), clima místico e celestial.',
    usage: 'Trilhas de cinema, Rock Progressivo, solos de fusão.'
  },
  major: {
    description: 'Escala Maior Natural (Jônio). Equilíbrio perfeito, sonoridade aberta, limpa e alegre.',
    usage: 'Pop, MPB, Rock, Sertanejo e Música Erudita.'
  },
  mixolydian: {
    description: 'Maior com 7ª Menor (7m). Pegada dominante e bluesy.',
    usage: 'Classic Rock, Blues, Forró, Baião e MPB.'
  },
  dorian: {
    description: 'Menor com 6ª Maior (6M). Som moderno e sofisticado.',
    usage: 'Funk americano, Soul, Jazz e Jam bands.'
  },
  minor: {
    description: 'Escala Menor Natural (Eólio). Sonoridade melancólica e introspectiva.',
    usage: 'Rock, Heavy Metal, Pop e Baladas.'
  },
  phrygian: {
    description: 'Menor com 2ª Menor (2m). Obscura com tensão espanhola e oriental.',
    usage: 'Flamenco, Heavy Metal e Música Árabe.'
  },
  locrian: {
    description: 'Máximo de obscuridade e tensão. Quinta Diminuta (5b) com Segunda Menor (2m).',
    usage: 'Jazz contemporâneo, Metal extremo.'
  },
  'major pentatonic': {
    description: 'Versão de 5 notas da escala maior. Luminosa e sem dissonâncias.',
    usage: 'Country, Pop, Gospel e R&B.'
  },
  'minor pentatonic': {
    description: 'A escala de 5 notas mais usada na guitarra. Muito versátil.',
    usage: 'Rock, Blues, Hard Rock.'
  },
  blues: {
    description: 'Pentatônica menor acrescida da "Blue Note" (5b).',
    usage: 'Blues tradicional, Hard Rock e Fusion.'
  },
  'harmonic minor': {
    description: 'Escala menor com a 7ª Maior. Salto característico de 1,5 tom.',
    usage: 'Música Neoclássica, Tango e Música Árabe.'
  },
  'melodic minor': {
    description: 'Escala menor com a 6ª e 7ª Maiores. Rica e fluida.',
    usage: 'Jazz moderno, Fusion.'
  }
};

export function formatIntervalNotation(intervalCode: string): string {
  const map: { [key: string]: string } = {
    '1P': 'T', '2m': '2m', '2M': '2M', '3m': '3m', '3M': '3M',
    '4P': '4J', '4A': '4#', '5d': '5b', '5P': '5J', '6m': '6m',
    '6M': '6M', '7m': '7m', '7M': '7M'
  };
  return map[intervalCode] || intervalCode;
}

export function getScaleTheoryInfo(tonic: string, scaleType: string): ScaleTheoryInfo {
  const rawScale = Scale.get(`${tonic} ${scaleType}`);
  const formula = rawScale.intervals.map((inv) => formatIntervalNotation(inv));
  const notes = rawScale.notes.map((n) => Note.pitchClass(n));
  const info = SCALE_DESCRIPTIONS[scaleType] || { description: '', usage: '' };

  return {
    name: `Escala ${scaleType.toUpperCase()} em ${tonic}`,
    formula,
    notes,
    description: info.description,
    usage: info.usage
  };
}

export function calculateFretboardDots(
  tonic: string,
  scaleType: string | 'chromatic',
  chromaticAccidental: 'sharp' | 'flat',
  fretsCount: number = 12,
  visibleIntervalNotes: string[],
  hiddenSingleDots: string[],
  displayMode: 'notes' | 'degrees',
  customTuning: string[] = STANDARD_TUNING
): FretDot[] {
  let scaleNotes: string[] = [];

  if (scaleType === 'chromatic') {
    scaleNotes = chromaticAccidental === 'sharp' ? CHROMATIC_SHARPS : CHROMATIC_FLATS;
  } else {
    const rawScale = Scale.get(`${tonic} ${scaleType}`);
    scaleNotes = rawScale.notes.map((n) => Note.pitchClass(n));
  }

  const dots: FretDot[] = [];

  customTuning.forEach((openNote, stringIndex) => {
    const stringNum = stringIndex + 1;

    for (let fret = 0; fret <= fretsCount; fret++) {
      const fretNote = Note.transpose(openNote, Interval.fromSemitones(fret));
      const pitchClass = Note.pitchClass(fretNote);
      const midi = Note.midi(fretNote) || 0;
      const dotId = `s-${stringNum}-f-${fret}`;

      const matchedScaleNote = scaleNotes.find(
        (sn) => Note.chroma(sn) === Note.chroma(pitchClass)
      );

      if (
        matchedScaleNote &&
        visibleIntervalNotes.includes(matchedScaleNote) &&
        !hiddenSingleDots.includes(dotId)
      ) {
        const intervalDistance = Interval.distance(tonic, matchedScaleNote);
        const intervalSimple = Interval.simplify(intervalDistance);
        const intervalCode = intervalSimple || '1P';

        const isRoot = Note.chroma(matchedScaleNote) === Note.chroma(tonic);
        const degreeText = displayMode === 'notes' ? matchedScaleNote : formatIntervalNotation(intervalCode);
        const colorConfig = INTERVAL_COLORS[intervalCode] || { bg: '#3b82f6', text: '#ffffff' };

        dots.push({
          id: dotId,
          stringNum,
          fretNum: fret,
          noteName: matchedScaleNote,
          degreeText,
          intervalCode,
          color: colorConfig.bg,
          isRoot,
          midi
        });
      }
    }
  });

  return dots;
}