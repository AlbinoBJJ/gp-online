import { useState, useEffect } from 'react';
import { Scale, Note, Interval } from '@tonaljs/tonal';
import { playAudioNote, loadAudioInstrument } from '@gp-online/audio-engine';
import {
  CHROMATIC_SHARPS,
  CHROMATIC_FLATS,
  STANDARD_TUNING,
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
  const [displayMode, setDisplayMode] = useState<'notes' | 'degrees'>('degrees');

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editTargetMode, setEditTargetMode] = useState<'single' | 'interval'>('single');

  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [selectedInstrument, setSelectedInstrument] = useState<string>('acoustic_guitar_steel');
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);

  const [visibleIntervalNotes, setVisibleIntervalNotes] = useState<string[]>([]);
  const [hiddenSingleDots, setHiddenSingleDots] = useState<string[]>([]);

  const TONIC_OPTIONS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

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
      playAudioNote(dot.midi, selectedInstrument);
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
    const openNote = STANDARD_TUNING[stringNum - 1];
    const fretNote = Note.transpose(openNote, Interval.fromSemitones(fretNum));
    const pitchClass = Note.pitchClass(fretNote);
    const midi = Note.midi(fretNote) || 0;

    if (isAudioEnabled && !isAudioLoading) {
      playAudioNote(midi, selectedInstrument);
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
    displayMode
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
    displayMode, setDisplayMode,
    isEditMode, setIsEditMode,
    editTargetMode, setEditTargetMode,
    isAudioEnabled, setIsAudioEnabled,
    selectedInstrument, setSelectedInstrument,
    isAudioLoading, currentNotes,
    visibleIntervalNotes, hiddenSingleDots,
    TONIC_OPTIONS, dots, theoryInfo,
    toggleIntervalGlobalVisibility, toggleAllIntervals,
    handleDotClick, handleEmptyFretClick
  };
}