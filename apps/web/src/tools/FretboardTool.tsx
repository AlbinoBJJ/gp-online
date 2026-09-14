import { useState } from 'react';
import {
  Guitar,
  Eye,
  Filter,
  BookOpen,
  Palette,
  Sliders,
  Volume2,
  VolumeX,
  X,
  ChevronDown,
  ChevronUp,
  Edit3,
  CheckCircle2,
  Target,
  Disc
} from 'lucide-react';
import {
  SCALE_GROUPS,
  INTERVAL_COLORS,
  INSTRUMENT_SOUNDS
} from './fretboard/fretboardCalculator';
import { FretboardCanvas } from './fretboard/FretboardCanvas';
import { Header } from '../components/Header';
import { useFretboard } from './fretboard/useFretboard';

interface FretboardToolProps {
  activeTool?: 'player' | 'fretboard' | 'ear-training';
  onSelectTool?: (tool: 'player' | 'fretboard' | 'ear-training') => void;
}

export function FretboardTool({ activeTool = 'fretboard', onSelectTool }: FretboardToolProps) {
  const {
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
    visibleIntervalNotes,
    TONIC_OPTIONS, dots, theoryInfo,
    toggleIntervalGlobalVisibility, toggleAllIntervals,
    handleDotClick, handleEmptyFretClick
  } = useFretboard();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isOptionsAccordionOpen, setIsOptionsAccordionOpen] = useState<boolean>(true);
  const [isTheoryAccordionOpen, setIsTheoryAccordionOpen] = useState<boolean>(false);
  const [isLegendAccordionOpen, setIsLegendAccordionOpen] = useState<boolean>(false);
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState<boolean>(false);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header activeTool={activeTool} onSelectTool={onSelectTool}>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          title="Ativar/Desativar Modo Edição"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: isEditMode ? '#f59e0b' : '#0f172a',
            color: isEditMode ? '#0f172a' : '#f8fafc',
            border: `1px solid ${isEditMode ? '#f59e0b' : '#334155'}`,
            padding: '6px 10px',
            borderRadius: '6px',
            fontWeight: 800,
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          {isEditMode ? <CheckCircle2 size={16} /> : <Edit3 size={16} />}
          <span className="desktop-only-text">Edição: {isEditMode ? 'ON' : 'OFF'}</span>
        </button>

        {isEditMode && (
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', padding: '2px', borderRadius: '6px', border: '1px solid #f59e0b' }}>
            <Target size={14} color="#f59e0b" style={{ marginLeft: '4px', marginRight: '4px' }} />
            <button
              onClick={() => setEditTargetMode('single')}
              style={{
                padding: '4px 6px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: editTargetMode === 'single' ? '#f59e0b' : 'transparent',
                color: editTargetMode === 'single' ? '#0f172a' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Nota
            </button>
            <button
              onClick={() => setEditTargetMode('interval')}
              style={{
                padding: '4px 6px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: editTargetMode === 'interval' ? '#f59e0b' : 'transparent',
                color: editTargetMode === 'interval' ? '#0f172a' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Grau
            </button>
          </div>
        )}

        <button
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          disabled={isAudioLoading}
          title={isAudioEnabled ? 'Desativar Som' : 'Ativar Som'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            backgroundColor: isAudioEnabled && !isAudioLoading ? '#10b981' : '#0f172a',
            color: isAudioEnabled && !isAudioLoading ? '#0f172a' : '#64748b',
            border: '1px solid #334155',
            borderRadius: '6px',
            cursor: isAudioLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          onClick={() => setIsDrawerOpen(true)}
          title="Opções Teóricas"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            backgroundColor: '#10b981',
            color: '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <Sliders size={18} />
        </button>
      </Header>

      <div style={{ flex: 1, paddingTop: '75px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Guitar size={22} color="#10b981" />
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>
              {isChromaticMode ? `Visão Cromática em ${tonic}` : `Escala ${scaleType.toUpperCase()} em ${tonic}`}
            </h2>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {isEditMode ? 'Modo Edição Ativo (Clique para ocultar/exibir)' : 'Toque nas notas para escutar'}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: '12px', padding: '16px', border: isEditMode ? '2px solid #f59e0b' : '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
          <FretboardCanvas
            fretsCount={fretsCount}
            dots={dots}
            onDotClick={handleDotClick}
            onEmptyFretClick={handleEmptyFretClick}
          />
        </div>
      </div>

      {isDrawerOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '380px', height: '100%', backgroundColor: '#1e293b', borderLeft: '1px solid #334155', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>Opções do Fretboard</h3>
              <button onClick={() => setIsDrawerOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Timbre do Instrumento:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', padding: '8px', borderRadius: '6px', border: '1px solid #334155' }}>
                <Disc size={16} color="#10b981" />
                <select
                  value={selectedInstrument}
                  disabled={isAudioLoading}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'transparent', color: '#10b981', border: 'none', fontWeight: 700, outline: 'none', fontSize: '12px' }}
                >
                  {INSTRUMENT_SOUNDS.map((inst) => (
                    <option key={inst.value} value={inst.value} style={{ backgroundColor: '#1e293b' }}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
              <button
                onClick={() => setIsOptionsAccordionOpen(!isOptionsAccordionOpen)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
              >
                <span>1. Selecionar Escala & Opções</span>
                {isOptionsAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isOptionsAccordionOpen && (
                <div style={{ padding: '12px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '8px', borderRadius: '6px', border: '1px solid #334155' }}>
                    <span style={{ fontSize: '11px', color: '#f8fafc', fontWeight: 700 }}>Modo Cromático:</span>
                    <button
                      onClick={() => setIsChromaticMode(!isChromaticMode)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: isChromaticMode ? '#10b981' : '#0f172a',
                        color: isChromaticMode ? '#0f172a' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      {isChromaticMode ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {isChromaticMode && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setChromaticAccidental('sharp')}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #334155',
                          backgroundColor: chromaticAccidental === 'sharp' ? '#10b981' : '#1e293b',
                          color: chromaticAccidental === 'sharp' ? '#0f172a' : '#94a3b8',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Sustenidos (#)
                      </button>
                      <button
                        onClick={() => setChromaticAccidental('flat')}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #334155',
                          backgroundColor: chromaticAccidental === 'flat' ? '#10b981' : '#1e293b',
                          color: chromaticAccidental === 'flat' ? '#0f172a' : '#94a3b8',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Bemóis (b)
                      </button>
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tônica:</span>
                    <select value={tonic} onChange={(e) => setTonic(e.target.value)} style={{ width: '100%', backgroundColor: '#1e293b', color: '#10b981', border: '1px solid #334155', padding: '6px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>
                      {TONIC_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Escala Tonal / Modal:</span>
                    <select disabled={isChromaticMode} value={scaleType} onChange={(e) => setScaleType(e.target.value)} style={{ width: '100%', backgroundColor: isChromaticMode ? '#0f172a' : '#1e293b', color: isChromaticMode ? '#64748b' : '#10b981', border: '1px solid #334155', padding: '6px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>
                      {SCALE_GROUPS.map((group) => (
                        <optgroup key={group.category} label={group.category}>
                          {group.items.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Trastes:</span>
                      <select value={fretsCount} onChange={(e) => setFretsCount(Number(e.target.value))} style={{ width: '100%', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '6px', borderRadius: '6px', fontSize: '12px' }}>
                        <option value={12}>12 Trastes</option>
                        <option value={15}>15 Trastes</option>
                        <option value={21}>21 Trastes</option>
                        <option value={24}>24 Trastes</option>
                      </select>
                    </div>

                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Exibição:</span>
                      <div style={{ display: 'flex', backgroundColor: '#1e293b', padding: '2px', borderRadius: '6px', border: '1px solid #334155' }}>
                        <button onClick={() => setDisplayMode('degrees')} style={{ flex: 1, padding: '5px', border: 'none', borderRadius: '4px', backgroundColor: displayMode === 'degrees' ? '#10b981' : 'transparent', color: displayMode === 'degrees' ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Graus</button>
                        <button onClick={() => setDisplayMode('notes')} style={{ flex: 1, padding: '5px', border: 'none', borderRadius: '4px', backgroundColor: displayMode === 'notes' ? '#10b981' : 'transparent', color: displayMode === 'notes' ? '#0f172a' : '#94a3b8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Notas</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
              <button
                onClick={() => setIsTheoryAccordionOpen(!isTheoryAccordionOpen)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} color="#10b981" />
                  <span>2. Fundamentação Teórica</span>
                </div>
                {isTheoryAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isTheoryAccordionOpen && (
                <div style={{ padding: '12px', borderTop: '1px solid #1e293b', maxHeight: '180px', overflowY: 'auto' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#10b981', fontSize: '13px' }}>{theoryInfo.name}</h4>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '4px 0 8px 0' }}>
                    {theoryInfo.formula.map((deg, idx) => (
                      <span key={idx} style={{ backgroundColor: '#1e293b', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>{deg}</span>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.3' }}>{theoryInfo.description}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#10b981' }}><strong>Aplicações:</strong> {theoryInfo.usage}</p>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
              <button
                onClick={() => setIsLegendAccordionOpen(!isLegendAccordionOpen)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Palette size={14} color="#10b981" />
                  <span>3. Legenda de Cores</span>
                </div>
                {isLegendAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isLegendAccordionOpen && (
                <div style={{ padding: '12px', borderTop: '1px solid #1e293b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                  {Object.entries(INTERVAL_COLORS).map(([code, conf]) => (
                    <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: conf.bg }} />
                      <span style={{ fontSize: '10px', color: '#f8fafc', fontWeight: 600 }}>{conf.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
              <button
                onClick={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} color="#10b981" />
                  <span>4. Filtro por Graus</span>
                </div>
                {isFilterAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isFilterAccordionOpen && (
                <div style={{ padding: '12px', borderTop: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {currentNotes.map((note) => {
                      const isVisible = visibleIntervalNotes.includes(note);
                      const isRoot = note === tonic;
                      return (
                        <button
                          key={note}
                          onClick={() => toggleIntervalGlobalVisibility(note)}
                          style={{
                            backgroundColor: isVisible ? (isRoot ? '#10b981' : '#3b82f6') : '#1e293b',
                            color: isVisible ? (isRoot ? '#0f172a' : '#ffffff') : '#64748b',
                            opacity: isVisible ? 1 : 0.4,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {note}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={toggleAllIntervals} style={{ width: '100%', backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Filter size={12} />
                    <span>{visibleIntervalNotes.length === currentNotes.length ? 'Desmarcar Todos' : 'Marcar Todos'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}