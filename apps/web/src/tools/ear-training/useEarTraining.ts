import { useState, useEffect } from 'react';
import { type QuizOption } from './chordGenerator';
import { playChordExerciseAudio, playDegreeWithReferenceAudio } from './earAudioPlayer';
import { loadAudioInstrument as loadInstrumentSound } from '@gp-online/audio-engine';

import { generateIntervalExercise, playIntervalAudio } from './intervalTrainer';
import { generateChordQualityExercise } from './chordQualityTrainer';
import { generateDegreeExercise } from './harmonicDegreeTrainer';
import { generateFunctionExercise } from './harmonicFunctionTrainer';

export type ExerciseType = 'interval' | 'chord_quality' | 'harmonic_degree' | 'harmonic_function';

export interface SessionLogEntry {
  id: number;
  timestamp: string;
  exerciseType: ExerciseType;
  keyRoot: string;
  targetNotes: string[];
  correctOption: QuizOption;
  selectedOption: QuizOption;
  isCorrect: boolean;
}

export function useEarTraining() {
  const [exerciseType, setExerciseType] = useState<ExerciseType>('interval');
  const [chordDifficulty, setChordDifficulty] = useState<'easy' | 'advanced'>('easy');
  const [isArpeggioEnabled, setIsArpeggioEnabled] = useState<boolean>(true);
  const [intervalDirection, setIntervalDirection] = useState<'ascending' | 'descending' | 'harmonic'>('ascending');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('acoustic_guitar_steel');
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);

  const [currentKeyRoot, setCurrentKeyRoot] = useState<string>('C4');
  const [questionNotes, setQuestionNotes] = useState<string[]>([]);
  const [correctOption, setCorrectOption] = useState<QuizOption>({ label: '', code: '' });
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [selectedAnswerCode, setSelectedAnswerCode] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Histórico de Sessão
  const [sessionLogs, setSessionLogs] = useState<SessionLogEntry[]>([]);

  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [report, setReport] = useState<{ [key in ExerciseType]: { correct: number; total: number } }>({
    interval: { correct: 0, total: 0 },
    chord_quality: { correct: 0, total: 0 },
    harmonic_degree: { correct: 0, total: 0 },
    harmonic_function: { correct: 0, total: 0 }
  });

  useEffect(() => {
    let isMounted = true;
    setIsAudioLoading(true);

    const promise = loadInstrumentSound(selectedInstrument);
    if (promise && typeof promise.then === 'function') {
      promise
        .then(() => { if (isMounted) setIsAudioLoading(false); })
        .catch(() => { if (isMounted) setIsAudioLoading(false); });
    } else {
      if (isMounted) setIsAudioLoading(false);
    }

    return () => { isMounted = false; };
  }, [selectedInstrument]);

  const playCurrentAudio = () => {
    if (isAudioLoading || questionNotes.length === 0) return;

    if (exerciseType === 'interval') {
      playIntervalAudio(questionNotes, selectedInstrument, intervalDirection);
    } else if (exerciseType === 'chord_quality') {
      playChordExerciseAudio(questionNotes, selectedInstrument, isArpeggioEnabled);
    } else if (exerciseType === 'harmonic_degree' || exerciseType === 'harmonic_function') {
      playDegreeWithReferenceAudio(currentKeyRoot, questionNotes, selectedInstrument, isArpeggioEnabled);
    }
  };

  const generateNewExercise = () => {
    setSelectedAnswerCode(null);
    setIsAnswered(false);

    const keyRoots = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'Bb3'];
    const selectedKey = keyRoots[Math.floor(Math.random() * keyRoots.length)];
    setCurrentKeyRoot(selectedKey);

    let exerciseResult: { targetNotes: string[]; correctObj: QuizOption; options: QuizOption[] };

    switch (exerciseType) {
      case 'interval':
        exerciseResult = generateIntervalExercise(selectedKey);
        break;
      case 'chord_quality':
        exerciseResult = generateChordQualityExercise(chordDifficulty);
        break;
      case 'harmonic_degree':
        exerciseResult = generateDegreeExercise(selectedKey);
        break;
      case 'harmonic_function':
        exerciseResult = generateFunctionExercise(selectedKey);
        break;
    }

    setQuestionNotes(exerciseResult.targetNotes);
    setCorrectOption(exerciseResult.correctObj);
    setQuizOptions(exerciseResult.options);
  };

  useEffect(() => {
    generateNewExercise();
  }, [exerciseType, intervalDirection, chordDifficulty]);

  const handleSelectAnswer = (option: QuizOption) => {
    if (isAnswered) return;

    setSelectedAnswerCode(option.code);
    setIsAnswered(true);

    const isCorrect = option.code === correctOption.code;

    // Grava a execução no log da sessão
    const newEntry: SessionLogEntry = {
      id: sessionLogs.length + 1,
      timestamp: new Date().toLocaleTimeString(),
      exerciseType,
      keyRoot: currentKeyRoot,
      targetNotes: questionNotes,
      correctOption,
      selectedOption: option,
      isCorrect
    };
    setSessionLogs((prev) => [...prev, newEntry]);

    setScore((prev) => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    setReport((prev) => ({
      ...prev,
      [exerciseType]: {
        correct: prev[exerciseType].correct + (isCorrect ? 1 : 0),
        total: prev[exerciseType].total + 1
      }
    }));

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  // Função para exportar os logs acumulados em arquivo TXT
  const downloadSessionLog = () => {
    if (sessionLogs.length === 0) return;

    let content = `==================================================\n`;
    content += `         LOG DE SESSÃO DO EAR TRAINING           \n`;
    content += `==================================================\n`;
    content += `Data: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    content += `Total de Exercícios: ${sessionLogs.length}\n`;
    content += `Acertos: ${score.correct} / Erros: ${score.total - score.correct}\n`;
    content += `--------------------------------------------------\n\n`;

    sessionLogs.forEach((log) => {
      content += `[#${log.id}] ${log.timestamp} | Tipo: ${log.exerciseType.toUpperCase()}\n`;
      content += `   Tom: ${log.keyRoot} | Notas Alvo: [${log.targetNotes.join(', ')}]\n`;
      content += `   Resposta Correta: ${log.correctOption.label} (${log.correctOption.code})\n`;
      content += `   Resposta do Usuário: ${log.selectedOption.label} (${log.selectedOption.code})\n`;
      content += `   Resultado: ${log.isCorrect ? 'CORRETO [OK]' : 'ERRADO [X]'}\n`;
      content += `--------------------------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ear-training-log-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    exerciseType, setExerciseType,
    chordDifficulty, setChordDifficulty,
    isArpeggioEnabled, setIsArpeggioEnabled,
    intervalDirection, setIntervalDirection,
    selectedInstrument, setSelectedInstrument,
    isAudioLoading, currentKeyRoot, questionNotes, correctOption, quizOptions,
    selectedAnswerCode, isAnswered, score, streak, bestStreak, report,
    sessionLogs, downloadSessionLog,
    playCurrentAudio, generateNewExercise, handleSelectAnswer
  };
}