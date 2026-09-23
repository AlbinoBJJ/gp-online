import { useState } from 'react';
import { Header } from '../components/Header';
import { ScoreViewerModal } from './ear-training/ScoreViewerModal';
import { useEarTraining } from './ear-training/useEarTraining';
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Flame,
  Award,
  Music,
  Sliders,
  X,
  Disc,
  BarChart2,
  Eye,
  Download
} from 'lucide-react';

interface EarTrainingToolProps {
  activeTool?: 'player' | 'fretboard' | 'ear-training';
  onSelectTool?: (tool: 'player' | 'fretboard' | 'ear-training') => void;
}

export function EarTrainingTool({ activeTool = 'ear-training', onSelectTool }: EarTrainingToolProps) {
  const {
    exerciseType, setExerciseType,
    chordDifficulty, setChordDifficulty,
    isArpeggioEnabled, setIsArpeggioEnabled,
    intervalDirection, setIntervalDirection,
    selectedInstrument, setSelectedInstrument,
    isAudioLoading, currentKeyRoot, questionNotes, correctOption, quizOptions,
    selectedAnswerCode, isAnswered, score, streak, bestStreak, report,
    sessionLogs, downloadSessionLog,
    playCurrentAudio, generateNewExercise, handleSelectAnswer
  } = useEarTraining();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isScoreViewerOpen, setIsScoreViewerOpen] = useState(false);

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
      <Header activeTool={activeTool} onSelectTool={onSelectTool}>
        <button onClick={() => setIsReportOpen(true)} title="Ver Relatório de Desempenho" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}>
          <BarChart2 size={18} />
        </button>

        <button onClick={() => setIsSettingsOpen(true)} title="Configurações do Exercício" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', backgroundColor: '#10b981', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          <Sliders size={18} />
        </button>
      </Header>

      <div style={{ flex: 1, paddingTop: '75px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px', overflow: 'hidden', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* PLACAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '6px 8px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Precisão</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>{score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : '0%'}</span>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '6px 8px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Flame size={12} color="#f59e0b" />
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Streak</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b' }}>{streak}</span>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '6px 8px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Award size={12} color="#3b82f6" />
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Recorde</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#3b82f6' }}>{bestStreak}</span>
          </div>
        </div>

        {/* ÁREA CENTRAL */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '14px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '150px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Music size={16} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: 700, textAlign: 'center' }}>
              {exerciseType === 'interval' && 'Escute o intervalo e selecione a alternativa:'}
              {exerciseType === 'chord_quality' && 'Escute o acorde e identifique a qualidade:'}
              {exerciseType === 'harmonic_degree' && 'Escute a referência (I) + acorde e identifique o grau:'}
              {exerciseType === 'harmonic_function' && 'Escute a referência (I) + acorde e identifique a função:'}
            </h3>
          </div>

          <button onClick={playCurrentAudio} disabled={isAudioLoading} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: isAudioLoading ? '#64748b' : '#10b981', color: '#0f172a', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', cursor: isAudioLoading ? 'not-allowed' : 'pointer' }}>
            <Volume2 size={16} />
            {isAudioLoading ? 'Carregando...' : 'Tocar Áudio'}
          </button>

          <div style={{ height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isAnswered ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedAnswerCode === correctOption.code ? (
                  <span style={{ color: '#10b981', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Correto: {correctOption.label}</span>
                ) : (
                  <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Errado! Correto: {correctOption.label}</span>
                )}
              </div>
            ) : (
              <span style={{ color: '#64748b', fontSize: '11px' }}>Aguardando resposta...</span>
            )}
          </div>
        </div>

        {/* ALTERNATIVAS */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${quizOptions.length}, 1fr)`, gap: '6px', width: '100%' }}>
          {quizOptions.map((opt, idx) => {
            const isSelected = selectedAnswerCode === opt.code;
            const isCorrect = opt.code === correctOption.code;

            let btnBg = '#1e293b'; let btnColor = '#f8fafc'; let btnBorder = '#334155';
            if (isAnswered) {
              if (isCorrect) { btnBg = '#10b981'; btnColor = '#0f172a'; btnBorder = '#10b981'; }
              else if (isSelected) { btnBg = '#ef4444'; btnColor = '#ffffff'; btnBorder = '#ef4444'; }
            }

            return (
              <button key={`${opt.code}-${idx}`} disabled={isAnswered} onClick={() => handleSelectAnswer(opt)} style={{ backgroundColor: btnBg, color: btnColor, border: `1px solid ${btnBorder}`, borderRadius: '8px', padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 700, fontSize: '11px', cursor: isAnswered ? 'default' : 'pointer', minHeight: '65px', textAlign: 'center' }}>
                <span style={{ backgroundColor: '#0f172a', color: isAnswered && isCorrect ? '#10b981' : '#94a3b8', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>{optionLetters[idx]}</span>
                <span style={{ fontSize: '10px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTROLES INFERIORES */}
        <div style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAnswered && (
            <>
              <button onClick={() => setIsScoreViewerOpen(true)} style={{ padding: '0 12px', height: '100%', backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #10b981', borderRadius: '8px', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} /> Partitura
              </button>
              <button onClick={generateNewExercise} style={{ flex: 1, height: '100%', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <RotateCcw size={14} /> Próximo Exercício
              </button>
            </>
          )}
        </div>
      </div>

      <ScoreViewerModal 
        isOpen={isScoreViewerOpen} 
        notes={questionNotes} 
        referenceKeyRoot={currentKeyRoot}
        exerciseType={exerciseType} 
        intervalDirection={intervalDirection} 
        exerciseTitle={correctOption.label} 
        onClose={() => setIsScoreViewerOpen(false)} 
      />

      {/* CONFIGURAÇÕES */}
      {isSettingsOpen && (
        <div 
          onClick={() => setIsSettingsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '340px', height: '100%', backgroundColor: '#1e293b', borderLeft: '1px solid #334155', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Opções do Ear Training</h3>
              <button onClick={() => setIsSettingsOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Tipo de Exercício:</span>
              <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value as any)} style={{ width: '100%', backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #334155', padding: '8px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>
                <option value="interval">Reconhecimento de Intervalos</option>
                <option value="chord_quality">Qualidade de Acordes</option>
                <option value="harmonic_degree">Graus do Campo Harmônico</option>
                <option value="harmonic_function">Funções Harmônicas</option>
              </select>
            </div>

            {/* SELETOR DE ARPEJO */}
            {(exerciseType === 'chord_quality' || exerciseType === 'harmonic_degree' || exerciseType === 'harmonic_function') && (
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Arpejar Notas Antes do Acorde:</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <button onClick={() => setIsArpeggioEnabled(true)} style={{ flex: 1, padding: '6px', border: 'none', borderRadius: '4px', backgroundColor: isArpeggioEnabled ? '#10b981' : 'transparent', color: isArpeggioEnabled ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Ligado (ON)</button>
                  <button onClick={() => setIsArpeggioEnabled(false)} style={{ flex: 1, padding: '6px', border: 'none', borderRadius: '4px', backgroundColor: !isArpeggioEnabled ? '#10b981' : 'transparent', color: !isArpeggioEnabled ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Desligado (OFF)</button>
                </div>
              </div>
            )}

            {exerciseType === 'chord_quality' && (
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Dificuldade dos Acordes:</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <button onClick={() => setChordDifficulty('easy')} style={{ flex: 1, padding: '6px', border: 'none', borderRadius: '4px', backgroundColor: chordDifficulty === 'easy' ? '#10b981' : 'transparent', color: chordDifficulty === 'easy' ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Iniciante (Tríades)</button>
                  <button onClick={() => setChordDifficulty('advanced')} style={{ flex: 1, padding: '6px', border: 'none', borderRadius: '4px', backgroundColor: chordDifficulty === 'advanced' ? '#10b981' : 'transparent', color: chordDifficulty === 'advanced' ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Avançado (Tétrades)</button>
                </div>
              </div>
            )}

            {exerciseType === 'interval' && (
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Direção Melódica:</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <button onClick={() => setIntervalDirection('ascending')} style={{ flex: 1, padding: '6px', border: 'none', borderRadius: '4px', backgroundColor: intervalDirection === 'ascending' ? '#10b981' : 'transparent', color: intervalDirection === 'ascending' ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Ascendente</button>
                  <button onClick={() => setIntervalDirection('descending')} style={{ flex: 1, padding: '6px', border: 'none', borderRadius: '4px', backgroundColor: intervalDirection === 'descending' ? '#10b981' : 'transparent', color: intervalDirection === 'descending' ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Descendente</button>
                  <button onClick={() => setIntervalDirection('harmonic')} style={{ flex: 1, padding: '6px', border: 'none', borderRadius: '4px', backgroundColor: intervalDirection === 'harmonic' ? '#10b981' : 'transparent', color: intervalDirection === 'harmonic' ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Harmônico</button>
                </div>
              </div>
            )}

            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Timbre do Instrumento:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px', border: '1px solid #334155' }}>
                <Disc size={16} color="#10b981" />
                <select value={selectedInstrument} onChange={(e) => setSelectedInstrument(e.target.value)} style={{ width: '100%', backgroundColor: 'transparent', color: '#10b981', border: 'none', fontWeight: 700, outline: 'none', fontSize: '12px' }}>
                  <option value="acoustic_guitar_steel">Violão de Aço</option>
                  <option value="electric_guitar_clean">Guitarra Elétrica</option>
                  <option value="electric_bass_finger">Baixo Elétrico</option>
                  <option value="acoustic_grand_piano">Piano Acústico</option>
                  <option value="violin">Violino</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RELATÓRIO */}
      {isReportOpen && (
        <div 
          onClick={() => setIsReportOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '340px', height: '100%', backgroundColor: '#1e293b', borderLeft: '1px solid #334155', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><BarChart2 size={16} color="#10b981" /> Relatório de Desempenho</h3>
              <button onClick={() => setIsReportOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(report).map(([key, data]) => {
                const labels: { [key: string]: string } = { interval: 'Intervalos', chord_quality: 'Acordes', harmonic_degree: 'Graus Harmônicos', harmonic_function: 'Funções Harmônicas' };
                const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <div key={key} style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      <span>{labels[key]}</span>
                      <span style={{ color: '#10b981' }}>{pct}% ({data.correct}/{data.total})</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTÃO DE EXPORTAÇÃO DE LOG */}
            <button
              onClick={downloadSessionLog}
              disabled={sessionLogs.length === 0}
              style={{
                marginTop: 'auto',
                backgroundColor: sessionLogs.length > 0 ? '#10b981' : '#334155',
                color: sessionLogs.length > 0 ? '#0f172a' : '#94a3b8',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: sessionLogs.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} />
              Baixar Log da Sessão ({sessionLogs.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}