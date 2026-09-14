import { type ReactNode } from 'react';
import { Music } from 'lucide-react';

interface HeaderProps {
  activeTool?: 'player' | 'fretboard' | 'ear-training';
  onSelectTool?: (tool: 'player' | 'fretboard' | 'ear-training') => void;
  children?: ReactNode;
}

export function Header({
  activeTool = 'player',
  onSelectTool,
  children
}: HeaderProps) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '65px',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: '#10b981', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Music size={20} color="#0f172a" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em' }}>
              GP-Online <span className="header-title-engine" style={{ color: '#10b981', fontSize: '12px', fontWeight: 500 }}>Engine</span>
            </h1>
            <span className="header-subtitle" style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Plataforma de Estudos</span>
          </div>
        </div>

        {onSelectTool && (
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
            <button
              onClick={() => onSelectTool('player')}
              style={{
                padding: '5px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '11px',
                border: 'none',
                backgroundColor: activeTool === 'player' ? '#10b981' : 'transparent',
                color: activeTool === 'player' ? '#0f172a' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Leitor
            </button>
            <button
              onClick={() => onSelectTool('fretboard')}
              style={{
                padding: '5px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '11px',
                border: 'none',
                backgroundColor: activeTool === 'fretboard' ? '#10b981' : 'transparent',
                color: activeTool === 'fretboard' ? '#0f172a' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Fretboard
            </button>
            <button
              onClick={() => onSelectTool('ear-training')}
              style={{
                padding: '5px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '11px',
                border: 'none',
                backgroundColor: activeTool === 'ear-training' ? '#10b981' : 'transparent',
                color: activeTool === 'ear-training' ? '#0f172a' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Ouvido
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </div>
    </header>
  );
}