import { RotateCcw, X } from 'lucide-react';

interface LoopModalProps {
  isOpen: boolean;
  loopStartBar: number;
  loopEndBar: number;
  totalBars: number;
  autoAccelerate: boolean;
  startSpeed: number;
  targetSpeed: number;
  speedStep: number;
  onClose: () => void;
  onLoopStartBarChange: (bar: number) => void;
  onLoopEndBarChange: (bar: number) => void;
  onAutoAccelerateChange: (checked: boolean) => void;
  onStartSpeedChange: (speed: number) => void;
  onTargetSpeedChange: (speed: number) => void;
  onSpeedStepChange: (step: number) => void;
  onApply: () => void;
}

export function LoopModal({
  isOpen,
  loopStartBar,
  loopEndBar,
  totalBars,
  autoAccelerate,
  startSpeed,
  targetSpeed,
  speedStep,
  onClose,
  onLoopStartBarChange,
  onLoopEndBarChange,
  onAutoAccelerateChange,
  onStartSpeedChange,
  onTargetSpeedChange,
  onSpeedStepChange,
  onApply
}: LoopModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ width: '420px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Loop & Auto-Acelerador</h3>
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Compasso Inicial (A):</label>
            <input type="number" min={1} max={loopEndBar} value={loopStartBar} onChange={(e) => onLoopStartBarChange(Number(e.target.value))} style={{ width: '100%', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '8px', fontSize: '14px' }} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Compasso Final (B):</label>
            <input type="number" min={loopStartBar} max={totalBars} value={loopEndBar} onChange={(e) => onLoopEndBarChange(Number(e.target.value))} style={{ width: '100%', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '8px', fontSize: '14px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
            <input type="checkbox" checked={autoAccelerate} onChange={(e) => onAutoAccelerateChange(e.target.checked)} style={{ accentColor: '#10b981', width: '18px', height: '18px' }} />
            <span>Incremento Automático de Velocidade</span>
          </label>

          {autoAccelerate && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Velocidade Inicial:</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{Math.round(startSpeed * 100)}%</span>
              </div>
              <input type="range" min="0.3" max="1.0" step="0.05" value={startSpeed} onChange={(e) => onStartSpeedChange(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Velocidade Meta (Máx):</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{Math.round(targetSpeed * 100)}%</span>
              </div>
              <input type="range" min={startSpeed} max="1.5" step="0.05" value={targetSpeed} onChange={(e) => onTargetSpeedChange(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Aumento por Repetição:</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>+{Math.round(speedStep * 100)}%</span>
              </div>
              <input type="range" min="0.01" max="0.2" step="0.01" value={speedStep} onChange={(e) => onSpeedStepChange(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
            </div>
          )}
        </div>

        <button 
          onClick={onApply}
          style={{ width: '100%', backgroundColor: '#10b981', color: '#0f172a', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
        >
          Aplicar Treino em Loop
        </button>
      </div>
    </div>
  );
}