import { AudioEngine } from '@gp-online/audio-engine';
import { Note } from '@tonaljs/tonal';

const audioEngine = AudioEngine.getInstance();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function playChordExerciseAudio(
  notes: string[],
  instrument: string = 'acoustic_guitar_steel',
  useArpeggio: boolean = true
) {
  await audioEngine.loadInstrument(instrument);
  const midis = notes.map((n) => Note.midi(n)).filter((m): m is number => m !== null);

  if (midis.length === 0) return;

  if (useArpeggio) {
    for (const midi of midis) {
      audioEngine.playNote(midi, instrument, 1.2);
      await delay(300);
    }
    await delay(250);
    midis.forEach((midi) => {
      audioEngine.playNote(midi, instrument, 2.0);
    });
  } else {
    midis.forEach((midi) => {
      audioEngine.playNote(midi, instrument, 2.0);
    });
  }
}

export async function playDegreeWithReferenceAudio(
  referenceRoot: string,
  targetNotes: string[],
  instrument: string = 'acoustic_guitar_steel',
  useArpeggio: boolean = true
) {
  // 1. Assegura o carregamento prévio do instrumento
  await audioEngine.loadInstrument(instrument);

  // Tríade I Maior de Referência (1P, 3M, 5P)
  const refMidis = [
    Note.midi(referenceRoot),
    Note.midi(Note.transpose(referenceRoot, '3M')),
    Note.midi(Note.transpose(referenceRoot, '5P'))
  ].filter((m): m is number => m !== null);

  const targetMidis = targetNotes.map((n) => Note.midi(n)).filter((m): m is number => m !== null);

  if (refMidis.length === 0 || targetMidis.length === 0) return;

  // 2. Toca a referência I
  refMidis.forEach((midi) => {
    audioEngine.playNote(midi, instrument, 1.2);
  });

  // Pausa para dissipação do som da referência
  await delay(1200);

  // 3. Toca o acorde alvo (com ou sem arpejo)
  if (useArpeggio) {
    for (const midi of targetMidis) {
      audioEngine.playNote(midi, instrument, 1.2);
      await delay(300);
    }
    await delay(250);
    targetMidis.forEach((midi) => {
      audioEngine.playNote(midi, instrument, 2.0);
    });
  } else {
    targetMidis.forEach((midi) => {
      audioEngine.playNote(midi, instrument, 2.0);
    });
  }
}