import type { KeySignature } from '../../types/music'

interface Props {
  keySignature: KeySignature
  width?: number
  height?: number
}

const STAFF_LINE_COUNT = 5
const LINE_SPACING = 16
const STAFF_TOP = 30
const STAFF_HEIGHT = (STAFF_LINE_COUNT - 1) * LINE_SPACING // 64

// step: 0=第1線(上), 1=第1線と第2線の間, 2=第2線, ...
// ト音記号基準で各音の位置
// ♯順: F5,C5,G5,D5,A4,E5,B4
// F5=第1線上(step=0), C5=第3間(step=3), G5=第1線より上(step=-1→0にクランプ)
// 実用的な位置（楽譜通り）:
const SHARP_STEPS  = [0, 3, -1, 2, 5, 1, 4]  // F5,C5,G5,D5,A4,E5,B4
// ♭順: B4,E5,A4,D5,G4,C5,F4
const FLAT_STEPS   = [4, 1, 5, 2, 6, 3, 7]   // B4,E5,A4,D5,G4,C5,F4

function staffY(step: number): number {
  return STAFF_TOP + step * (LINE_SPACING / 2)
}

export default function KeySignatureDisplay({ keySignature, width = 560, height = 130 }: Props) {
  const lines = Array.from({ length: STAFF_LINE_COUNT }, (_, i) => i)
  const clefEndX = 70
  const accidentalSpacing = 14

  const symbols: { x: number; y: number; symbol: string }[] = []

  if (keySignature.type === 'sharp') {
    for (let i = 0; i < keySignature.count; i++) {
      symbols.push({
        x: clefEndX + i * accidentalSpacing,
        y: staffY(SHARP_STEPS[i]),
        symbol: '♯',
      })
    }
  } else if (keySignature.type === 'flat') {
    for (let i = 0; i < keySignature.count; i++) {
      symbols.push({
        x: clefEndX + i * accidentalSpacing,
        y: staffY(FLAT_STEPS[i]),
        symbol: '♭',
      })
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width }}
      aria-label={`調号: ${keySignature.majorKey}`}
    >
      {/* 五線 */}
      {lines.map(i => (
        <line
          key={i}
          x1={14} y1={STAFF_TOP + i * LINE_SPACING}
          x2={width - 14} y2={STAFF_TOP + i * LINE_SPACING}
          stroke="#222" strokeWidth={1.5}
        />
      ))}

      {/* ト音記号 */}
      <text
        x={10} y={STAFF_TOP + STAFF_HEIGHT - LINE_SPACING + 8}
        fontSize={72} fontFamily="serif" fill="#222"
      >
        𝄞
      </text>

      {/* 調号記号 */}
      {symbols.map((s, i) => (
        <text
          key={i}
          x={s.x + 6}
          y={s.y + 14}
          fontSize={18}
          fontFamily="serif"
          fill="#222"
          textAnchor="middle"
          fontWeight="bold"
        >
          {s.symbol}
        </text>
      ))}

      {/* 調号なし */}
      {keySignature.type === 'none' && (
        <text
          x={clefEndX + 30}
          y={STAFF_TOP + STAFF_HEIGHT / 2 + 5}
          fontSize={13}
          fill="#999"
          textAnchor="middle"
        >
          (調号なし)
        </text>
      )}
    </svg>
  )
}
