import { Note, Chord } from '@tonaljs/tonal';

export interface QuizOption {
  label: string;
  code: string;
}

export interface ChordExercise {
  targetNotes: string[];
  correctCode: string;
  correctLabel: string;
  options: QuizOption[];
}

const EASY_CHORDS: QuizOption[] = [
  { label: 'Maior (Tríade)', code: 'M' },
  { label: 'Menor (Tríade)', code: 'm' },
  { label: 'Diminuto', code: 'dim' },
  { label: 'Aumentado', code: 'aug' }
];

const ADVANCED_CHORDS: QuizOption[] = [
  ...EASY_CHORDS,
  { label: 'Dominante (7)', code: '7' },
  { label: 'Maior com Sétima (maj7)', code: 'maj7' },
  { label: 'Menor com Sétima (m7)', code: 'm7' }
];

export function generateChordExercise(difficulty: 'easy' | 'advanced' = 'easy'): ChordExercise {
  const roots = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'Bb3', 'C4', 'D4', 'E4'];
  const randomRoot = roots[Math.floor(Math.random() * roots.length)];
  
  const pool = difficulty === 'easy' ? EASY_CHORDS : ADVANCED_CHORDS;
  const selectedChord = pool[Math.floor(Math.random() * pool.length)];

  const pitch = Note.pitchClass(randomRoot);
  const symbol = selectedChord.code === 'M' ? '' : selectedChord.code;
  const chordData = Chord.get(`${pitch}${symbol}`);

  // Garante a Posição Fundamental sem inversões acidentais usando intervalos do Tonal.js
  const targetNotes = chordData.intervals.map((interval) =>
    Note.transpose(randomRoot, interval)
  );

  const distractors = pool.filter((c) => c.code !== selectedChord.code);
  const shuffled = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);
  const options = [...shuffled, selectedChord].sort(() => 0.5 - Math.random());

  return {
    targetNotes,
    correctCode: selectedChord.code,
    correctLabel: selectedChord.label,
    options
  };
}