import { Note } from '@tonaljs/tonal';
import { type QuizOption } from './chordGenerator';

export const ALL_FUNCTIONS: QuizOption[] = [
  { label: 'Tônica (Estabilidade)', code: 'Tonica' },
  { label: 'Subdominante (Afastamento)', code: 'Subdominante' },
  { label: 'Dominante (Tensão)', code: 'Dominante' }
];

interface FunctionMapping {
  functionCode: 'Tonica' | 'Subdominante' | 'Dominante';
  degreeCode: string;
  transpose: string;
  chordType: '3M' | '3m';
  fifthType: '5P' | '5d';
}

const ALL_HARMONIC_POSSIBILITIES: FunctionMapping[] = [
  // Tônica
  { functionCode: 'Tonica', degreeCode: 'I', transpose: '1P', chordType: '3M', fifthType: '5P' },
  { functionCode: 'Tonica', degreeCode: 'iii', transpose: '3M', chordType: '3m', fifthType: '5P' },
  { functionCode: 'Tonica', degreeCode: 'vi', transpose: '6M', chordType: '3m', fifthType: '5P' },

  // Subdominante
  { functionCode: 'Subdominante', degreeCode: 'IV', transpose: '4P', chordType: '3M', fifthType: '5P' },
  { functionCode: 'Subdominante', degreeCode: 'ii', transpose: '2M', chordType: '3m', fifthType: '5P' },

  // Dominante (Forçando inclusão do V e do vii°)
  { functionCode: 'Dominante', degreeCode: 'V', transpose: '5P', chordType: '3M', fifthType: '5P' },
  { functionCode: 'Dominante', degreeCode: 'vii°', transpose: '7M', chordType: '3m', fifthType: '5d' }
];

export function generateFunctionExercise(selectedKey: string) {
  const selectedPossibility = ALL_HARMONIC_POSSIBILITIES[
    Math.floor(Math.random() * ALL_HARMONIC_POSSIBILITIES.length)
  ];

  const correctObj = ALL_FUNCTIONS.find(
    (f) => f.code === selectedPossibility.functionCode
  ) || ALL_FUNCTIONS[0];

  const targetRoot = Note.transpose(selectedKey, selectedPossibility.transpose);

  const targetNotes = [
    targetRoot,
    Note.transpose(targetRoot, selectedPossibility.chordType),
    Note.transpose(targetRoot, selectedPossibility.fifthType)
  ].filter((n): n is string => n !== null && n !== undefined);

  const distractors = ALL_FUNCTIONS.filter((item) => item.code !== correctObj.code);
  const options = [...distractors, correctObj].sort(() => 0.5 - Math.random());

  console.log(`[FunctionTrainer] Tom: ${selectedKey} | Função: ${correctObj.code} | Grau: ${selectedPossibility.degreeCode} | Notas:`, targetNotes);

  return { targetNotes, correctObj, options };
}