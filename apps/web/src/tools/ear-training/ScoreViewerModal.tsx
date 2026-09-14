import { useEffect, useRef } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { Note } from '@tonaljs/tonal';
import { X, Music } from 'lucide-react';

interface ScoreViewerModalProps {
  isOpen: boolean;
  notes: string[];
  referenceKeyRoot?: string;
  exerciseType: 'interval' | 'chord_quality' | 'harmonic_degree' | 'harmonic_function';
  intervalDirection?: 'ascending' | 'descending' | 'harmonic';
  exerciseTitle: string;
  onClose: () => void;
}

export function ScoreViewerModal({
  isOpen,
  notes,
  referenceKeyRoot = 'C4',
  exerciseType,
  intervalDirection = 'ascending',
  exerciseTitle,
  onClose
}: ScoreViewerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current || notes.length === 0) return;

    const baseOctave = Note.octave(notes[0]) || 4;
    const clef = baseOctave <= 3 ? 'bass' : 'treble';

    let texCode = '';

    if (exerciseType === 'harmonic_degree' || exerciseType === 'harmonic_function') {
      // 1. Constrói o acorde de referência (I Maior: Tônica + 3M + 5J)
      const refNotes = [
        referenceKeyRoot,
        Note.transpose(referenceKeyRoot, '3M'),
        Note.transpose(referenceKeyRoot, '5P')
      ];
      const refBlock = refNotes.join(' ');
      const targetBlock = notes.join(' ');

      // Renderiza dois acordes separados por barra de compasso: [Acorde I (Referência)] | [Acorde Alvo]
      texCode = `\\title "${exerciseTitle}" . \\clef ${clef} :4 (${refBlock}) | :4 (${targetBlock})`;

    } else if (exerciseType === 'interval' && intervalDirection !== 'harmonic') {
      // Renderiza nota por nota no intervalo melódico
      const displayNotes = intervalDirection === 'descending' ? [...notes].reverse() : notes;
      const formattedMelodic = displayNotes.map((n) => `${n} :4`).join(' ');
      texCode = `\\title "${exerciseTitle}" . \\clef ${clef} ${formattedMelodic}`;

    } else {
      // Renderiza um único acorde em bloco (Qualidade de Acorde ou Intervalo Harmônico)
      const formattedBlock = notes.join(' ');
      texCode = `\\title "${exerciseTitle}" . \\clef ${clef} :4 (${formattedBlock})`;
    }

    const api = new alphaTab.AlphaTabApi(containerRef.current, {
      core: {
        engine: 'svg',
        fontDirectory: '/font/'
      },
      display: {
        layoutMode: alphaTab.LayoutMode.Horizontal,
        scale: 1.0
      }
    });

    api.tex(texCode);

    return () => {
      api.destroy();
    };
  }, [isOpen, notes, referenceKeyRoot, exerciseType, intervalDirection, exerciseTitle]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={18} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 700 }}>Partitura do Exercício</h3>
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '12px', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div ref={containerRef} style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}