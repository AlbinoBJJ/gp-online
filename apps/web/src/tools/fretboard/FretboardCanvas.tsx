import { type FretDot, INTERVAL_COLORS } from './fretboardCalculator';

interface FretboardCanvasProps {
  fretsCount: number;
  dots: FretDot[];
  onDotClick?: (dot: FretDot) => void;
  onEmptyFretClick?: (stringNum: number, fretNum: number) => void;
}

export function FretboardCanvas({
  fretsCount,
  dots,
  onDotClick,
  onEmptyFretClick
}: FretboardCanvasProps) {
  const numStrings = 6;
  const paddingX = 40;
  const paddingY = 30;
  const fretWidth = 60;
  const stringDistance = 28;

  const totalWidth = paddingX * 2 + fretsCount * fretWidth;
  const totalHeight = paddingY * 2 + (numStrings - 1) * stringDistance;

  const getFretX = (fret: number) => {
    if (fret === 0) return paddingX - 12;
    return paddingX + (fret - 0.5) * fretWidth;
  };

  const getStringY = (stringNum: number) => {
    return paddingY + (numStrings - stringNum) * stringDistance;
  };

  const singleMarkFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleMarkFrets = [12, 24];

  const activeDotMap = new Set(dots.map((d) => d.id));

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight + 30}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          maxHeight: '100%',
          display: 'block',
          margin: '0 auto',
          background: '#0f172a',
          borderRadius: '8px'
        }}
      >
        {/* Marcações de Traste (Inlays) */}
        {singleMarkFrets.map((fret) => {
          if (fret > fretsCount) return null;
          const x = paddingX + (fret - 0.5) * fretWidth;
          const y = paddingY + ((numStrings - 1) * stringDistance) / 2;
          return <circle key={`mark-${fret}`} cx={x} cy={y} r={5} fill="#334155" />;
        })}

        {doubleMarkFrets.map((fret) => {
          if (fret > fretsCount) return null;
          const x = paddingX + (fret - 0.5) * fretWidth;
          const y1 = paddingY + stringDistance;
          const y2 = paddingY + (numStrings - 2) * stringDistance;
          return (
            <g key={`double-mark-${fret}`}>
              <circle cx={x} cy={y1} r={5} fill="#334155" />
              <circle cx={x} cy={y2} r={5} fill="#334155" />
            </g>
          );
        })}

        {/* Traste 0 (Nut / Pestana) */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={paddingX}
          y2={paddingY + (numStrings - 1) * stringDistance}
          stroke="#10b981"
          strokeWidth={6}
        />

        {/* Trastes (Linhas verticais) */}
        {Array.from({ length: fretsCount }).map((_, i) => {
          const fretNum = i + 1;
          const x = paddingX + fretNum * fretWidth;
          return (
            <g key={`fret-${fretNum}`}>
              <line
                x1={x}
                y1={paddingY}
                x2={x}
                y2={paddingY + (numStrings - 1) * stringDistance}
                stroke="#475569"
                strokeWidth={1.5}
              />
              <text
                x={x - fretWidth / 2}
                y={totalHeight + 18}
                fill="#64748b"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                {fretNum}
              </text>
            </g>
          );
        })}

        {/* Cordas (Linhas horizontais) */}
        {Array.from({ length: numStrings }).map((_, i) => {
          const stringNum = i + 1;
          const y = getStringY(stringNum);
          const strokeWidth = 1 + (numStrings - stringNum) * 0.4;
          return (
            <line
              key={`string-${stringNum}`}
              x1={paddingX}
              y1={y}
              x2={paddingX + fretsCount * fretWidth}
              y2={y}
              stroke="#94a3b8"
              strokeWidth={strokeWidth}
            />
          );
        })}

        {/* Áreas Clicáveis em Posições Vagas */}
        {Array.from({ length: numStrings }).map((_, sIdx) => {
          const stringNum = sIdx + 1;
          return Array.from({ length: fretsCount + 1 }).map((_, fIdx) => {
            const fretNum = fIdx;
            const dotId = `s-${stringNum}-f-${fretNum}`;
            if (activeDotMap.has(dotId)) return null;

            const cx = getFretX(fretNum);
            const cy = getStringY(stringNum);

            return (
              <circle
                key={`empty-${dotId}`}
                cx={cx}
                cy={cy}
                r={14}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => onEmptyFretClick && onEmptyFretClick(stringNum, fretNum)}
              />
            );
          });
        })}

        {/* Pontos Clicáveis Ativos */}
        {dots.map((dot) => {
          const cx = getFretX(dot.fretNum);
          const cy = getStringY(dot.stringNum);
          const colorConfig = INTERVAL_COLORS[dot.intervalCode] || { bg: '#3b82f6', text: '#ffffff' };

          return (
            <g
              key={`dot-${dot.id}`}
              onClick={() => onDotClick && onDotClick(dot)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={13}
                fill={colorConfig.bg}
                stroke="#0f172a"
                strokeWidth={2}
              />
              <text
                x={cx}
                y={cy + 4}
                fill={colorConfig.text}
                fontSize="10"
                fontWeight="800"
                textAnchor="middle"
                style={{ userSelect: 'none' }}
              >
                {dot.degreeText}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}