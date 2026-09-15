import { useState, useEffect } from 'react';
import { Scale, Note, Interval } from '@tonaljs/tonal';
import { AudioEngine, loadAudioInstrument } from '@gp-online/audio-engine';
import {
  CHROMATIC_SHARPS,
  CHROMATIC_FLATS,
  STANDARD_TUNING,
  DEFAULT_TUNINGS,
  calculateFretboardDots,
  getScaleTheoryInfo,
  type FretDot
} from './fretboardCalculator';

export function useFretboard() {
  const [tonic, setTonic] = useState<string>('C');
  const [scaleType, setScaleType] = useState<string>('major');
  const [isChromaticMode, setIsChromaticMode] = useState<boolean>(false);
  const [chromaticAccidental, setChromaticAccidental] = useState<'sharp' | 'flat'>('sharp');

  const [fretsCount, setFretsCount] = useState<number>(12);
  const [stringCount, setStringCount] = useState<number>(6);
  const [customTuning, setCustomTuning] = useState<string[]>(STANDARD_TUNING);

  const [displayMode, setDisplayMode] = useState<'notes' | 'degrees'>('degrees');

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editTargetMode, setEditTargetMode] = useState<'single' | 'interval'>('single');

  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isPolyphonyEnabled, setIsPolyphonyEnabled] = useState<boolean>(false);
  const [selectedInstrument, setSelectedInstrument] = useState<string>('acoustic_guitar_steel');
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);

  const [visibleIntervalNotes, setVisibleIntervalNotes] = useState<string[]>([]);
  const [hiddenSingleDots, setHiddenSingleDots] = useState<string[]>([]);

  const TONIC_OPTIONS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
  const AVAILABLE_NOTES_POOL = ['B0', 'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];

  const handleStringCountChange = (newCount: number) => {
    setStringCount(newCount);
    const defaultTune = DEFAULT_TUNINGS[newCount] || Array(newCount).fill('E4');
    setCustomTuning(defaultTune);
  };

  const handleTuningNoteChange = (index: number, newNote: string) => {
    const updated = [...customTuning];
    updated[index] = newNote;
    setCustomTuning(updated);
  };

  const getAvailableNotes = (): string[] => {
    if (isChromaticMode) {
      return chromaticAccidental === 'sharp' ? CHROMATIC_SHARPS : CHROMATIC_FLATS;
    }
    const rawScale = Scale.get(`${tonic} ${scaleType}`);
    return rawScale.notes.map((n) => Note.pitchClass(n));
  };

  const currentNotes = getAvailableNotes();

  useEffect(() => {
    let isMounted = true;
    setIsAudioLoading(true);

    const promise = loadAudioInstrument(selectedInstrument);

    if (promise && typeof promise.then === 'function') {
      promise
        .then(() => {
          if (isMounted) setIsAudioLoading(false);
        })
        .catch(() => {
          if (isMounted) setIsAudioLoading(false);
        });
    } else {
      if (isMounted) setIsAudioLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedInstrument]);

  useEffect(() => {
    setVisibleIntervalNotes(currentNotes);
    setHiddenSingleDots([]);
  }, [tonic, scaleType, isChromaticMode, chromaticAccidental]);

  const toggleIntervalGlobalVisibility = (noteToToggle: string) => {
    setVisibleIntervalNotes((prev) =>
      prev.includes(noteToToggle)
        ? prev.filter((n) => n !== noteToToggle)
        : [...prev, noteToToggle]
    );
  };

  const toggleAllIntervals = () => {
    if (visibleIntervalNotes.length === currentNotes.length) {
      setVisibleIntervalNotes([]);
    } else {
      setVisibleIntervalNotes(currentNotes);
    }
    setHiddenSingleDots([]);
  };

  const handleDotClick = (dot: FretDot) => {
    if (isAudioEnabled && !isAudioLoading) {
      AudioEngine.getInstance().playNote(dot.midi, selectedInstrument, 2.0, isPolyphonyEnabled);
    }

    if (isEditMode) {
      if (editTargetMode === 'single') {
        setHiddenSingleDots((prev) => [...prev, dot.id]);
      } else {
        toggleIntervalGlobalVisibility(dot.noteName);
      }
    }
  };

  const handleEmptyFretClick = (stringNum: number, fretNum: number) => {
    const dotId = `s-${stringNum}-f-${fretNum}`;
    const openNote = customTuning[stringNum - 1];
    const fretNote = Note.transpose(openNote, Interval.fromSemitones(fretNum));
    const pitchClass = Note.pitchClass(fretNote);
    const midi = Note.midi(fretNote) || 0;

    if (isAudioEnabled && !isAudioLoading) {
      AudioEngine.getInstance().playNote(midi, selectedInstrument, 2.0, isPolyphonyEnabled);
    }

    if (isEditMode) {
      if (editTargetMode === 'single' && hiddenSingleDots.includes(dotId)) {
        setHiddenSingleDots((prev) => prev.filter((id) => id !== dotId));
      } else if (editTargetMode === 'interval' && !visibleIntervalNotes.includes(pitchClass)) {
        toggleIntervalGlobalVisibility(pitchClass);
      }
    }
  };

  const dots = calculateFretboardDots(
    tonic,
    isChromaticMode ? 'chromatic' : scaleType,
    chromaticAccidental,
    fretsCount,
    visibleIntervalNotes,
    hiddenSingleDots,
    displayMode,
    customTuning
  );

  const theoryInfo = isChromaticMode
    ? {
        name: `Visão Cromática Completa (Tônica: ${tonic})`,
        formula: ['T', '2m', '2M', '3m', '3M', '4J', '4#', '5J', '6m', '6M', '7m', '7M'],
        notes: chromaticAccidental === 'sharp' ? CHROMATIC_SHARPS : CHROMATIC_FLATS,
        description: 'Mapeamento cromático contendo todas as 12 notas do braço do instrumento.',
        usage: 'Exercícios de agilidade e memorização.'
      }
    : getScaleTheoryInfo(tonic, scaleType);

  return {
    tonic, setTonic,
    scaleType, setScaleType,
    isChromaticMode, setIsChromaticMode,
    chromaticAccidental, setChromaticAccidental,
    fretsCount, setFretsCount,
    stringCount, handleStringCountChange,
    customTuning, handleTuningNoteChange,
    AVAILABLE_NOTES_POOL,
    displayMode, setDisplayMode,
    isEditMode, setIsEditMode,
    editTargetMode, setEditTargetMode,
    isAudioEnabled, setIsAudioEnabled,
    isPolyphonyEnabled, setIsPolyphonyEnabled,
    selectedInstrument, setSelectedInstrument,
    isAudioLoading, currentNotes,
    visibleIntervalNotes, hiddenSingleDots,
    TONIC_OPTIONS, dots, theoryInfo,
    toggleIntervalGlobalVisibility, toggleAllIntervals,
    handleDotClick, handleEmptyFretClick
  };
}