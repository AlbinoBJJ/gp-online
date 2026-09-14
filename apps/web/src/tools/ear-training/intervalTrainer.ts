import { Note, Interval } from '@tonaljs/tonal';
import { type QuizOption } from './chordGenerator';
import { playAudioNote as playInstrumentNote } from '@gp-online/audio-engine';

export const ALL_INTERVALS: QuizOption[] = [
  { label: '2ª Menor', code: '2m' }, { label: '2ª Maior', code: '2M' },
  { label: '3ª Menor', code: '3m' }, { label: '3ª Maior', code: '3M' },
  { label: '4ª Justa', code: '4J' }, { label: 'Tritono (4#/5b)', code: '4T' },
  { label: '5ª Justa', code: '5J' }, { label: '6ª Menor', code: '6m' },
  { label: '6ª Maior', code: '6M' }, { label: '7ª Menor', code: '7m' },
  { label: '7ª Maior', code: '7M' }, { label: 'Oitava Justa', code: '8J' }
];

const SEMITONES_MAP: { [key: string]: number } = {
  '2m': 1, '2M': 2, '3m': 3, '3M': 4, '4J': 5,
  '4T': 6, '5J': 7, '6m': 8, '6M': 9, '7m': 10, '7M': 11, '8J': 12
};

export function generateIntervalExercise(rootKey: string) {
  const correctObj = ALL_INTERVALS[Math.floor(Math.random() * ALL_INTERVALS.length)];
  const semitones = SEMITONES_MAP[correctObj.code] || 1;
  const secondNote = Note.transpose(rootKey, Interval.fromSemitones(semitones));
  const targetNotes = [rootKey, secondNote].filter((n): n is string => n !== null && n !== undefined);

  const distractors = ALL_INTERVALS.filter((item) => item.code !== correctObj.code);
  const shuffled = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);
  const options = [...shuffled, correctObj].sort(() => 0.5 - Math.random());

  // Log adicionado para monitorar a geração de intervalos
  console.log(`[IntervalTrainer] Tom Fundamental: ${rootKey} | Intervalo: ${correctObj.label} (${correctObj.code}) | Notas:`, targetNotes);

  return { targetNotes, correctObj, options };
}

export function playIntervalAudio(
  notes: string[],
  instrument: string,
  direction: 'ascending' | 'descending' | 'harmonic'
) {
  if (direction !== 'harmonic') {
    const order = direction === 'ascending' ? notes : [...notes].reverse();
    order.forEach((noteName, idx) => {
      const midi = Note.midi(noteName);
      if (midi) setTimeout(() => playInstrumentNote(midi, instrument), idx * 550);
    });
  } else {
    notes.forEach((noteName) => {
      const midi = Note.midi(noteName);
      if (midi) playInstrumentNote(midi, instrument);
    });
  }
}