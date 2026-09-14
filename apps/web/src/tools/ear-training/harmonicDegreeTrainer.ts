import { Note } from '@tonaljs/tonal';
import { type QuizOption } from './chordGenerator';

export const ALL_DEGREES: QuizOption[] = [
  { label: 'I (Primeiro Grau)', code: 'I' },
  { label: 'ii (Segundo Grau)', code: 'ii' },
  { label: 'iii (Terceiro Grau)', code: 'iii' },
  { label: 'IV (Quarto Grau)', code: 'IV' },
  { label: 'V (Quinto Grau)', code: 'V' },
  { label: 'vi (Sexto Grau)', code: 'vi' },
  { label: 'vii° (Sétimo Grau)', code: 'vii°' }
];

const DIATONIC_DEGREE_MAP: { [key: string]: { transpose: string; chordType: '3M' | '3m'; fifthType: '5P' | '5d' } } = {
  'I':    { transpose: '1P', chordType: '3M', fifthType: '5P' },
  'ii':   { transpose: '2M', chordType: '3m', fifthType: '5P' },
  'iii':  { transpose: '3M', chordType: '3m', fifthType: '5P' },
  'IV':   { transpose: '4P', chordType: '3M', fifthType: '5P' },
  'V':    { transpose: '5P', chordType: '3M', fifthType: '5P' },
  'vi':   { transpose: '6M', chordType: '3m', fifthType: '5P' },
  'vii°': { transpose: '7M', chordType: '3m', fifthType: '5d' }
};

export function generateDegreeExercise(selectedKey: string) {
  // Garantia de sorteio uniforme de todos os 7 graus
  const correctObj = ALL_DEGREES[Math.floor(Math.random() * ALL_DEGREES.length)];
  const spec = DIATONIC_DEGREE_MAP[correctObj.code] || DIATONIC_DEGREE_MAP['I'];
  const degreeRoot = Note.transpose(selectedKey, spec.transpose);

  const targetNotes = [
    degreeRoot,
    Note.transpose(degreeRoot, spec.chordType),
    Note.transpose(degreeRoot, spec.fifthType)
  ].filter((n): n is string => n !== null && n !== undefined);

  const distractors = ALL_DEGREES.filter((item) => item.code !== correctObj.code);
  const shuffled = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);
  const options = [...shuffled, correctObj].sort(() => 0.5 - Math.random());

  console.log(`[DegreeTrainer] Tom: ${selectedKey} | Grau Sorteado: ${correctObj.code} | Notas:`, targetNotes);

  return { targetNotes, correctObj, options };
}