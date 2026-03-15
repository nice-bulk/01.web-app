import type { Note, KeySignature, Clef } from '../../types/music'
import { SHARP_ORDER, FLAT_ORDER } from '../../data/music'

interface Props {
  clef: Clef
  keySignature: KeySignature
  notes: Note[]
  width?: number
  height?: number
}

const LINE_SPACING = 16
const STAFF_TOP = 36
const STAFF_LINE_COUNT = 5
const STAFF_HEIGHT = (STAFF_LINE_COUNT - 1) * LINE_SPACING // 64

// ト音記号基準の音名→stave step（C4=0, D4=1, E4=2 ... B4=6, C5=7 ...）
// step 0 = 第3間（C4）、上に行くほど step 増
// SVG y座標: STAFF_TOP + (基準step - note_step) * (LINE_SPACING/2)
// 第1線(E4)=step2, 第3線(B4)=step6, 第5線(F5)=step10

// ト音記号: 第1線=E4
const TREBLE_BASE_NOTE = { name: 'C', octave: 4, step: 0 }
// ヘ音記号: 第1線=G2
const BASS_BASE_NOTE   = { name: 'E', octave: 2, step: 0 }

const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

function noteToStep(name: string, octave: number, clef: Clef): number {
  const base = clef === 'treble' ? TREBLE_BASE_NOTE : BASS_BASE_NOTE
  const baseIdx = NOTE_NAMES.indexOf(base.name) + base.octave * 7
  const noteIdx = NOTE_NAMES.indexOf(name) + octave * 7
  return noteIdx - baseIdx
}

// step → SVG y（stepが大きい=高い音=y小さい）
// ト音記号: step=0(C4)は第5線の下2本下（加線領域）
// 五線の中央(B4=step6)をSTAFF_TOP+STAFF_HEIGHT/2に設定
function stepToY(step: number, clef: Clef): number {
  // ト音記号: step6=B4=第3線(STAFF_TOP + LINE_SPACING*2)
  // ヘ音記号: step6=B3=第3線
  const centerStep = clef === 'treble' ? 6 : 6  // B4 / B3 = 第3線
  const centerY = STAFF_TOP + LINE_SPACING * 2   // 第3線のY
  return centerY - (step - centerStep) * (LINE_SPACING / 2)
}

// ♯の位置（ト音記号）
const SHARP_STEPS_TREBLE = [10, 7, 11, 8, 5, 9, 6]   // F5,C5,G5,D5,A4,E5,B4
const FLAT_STEPS_TREBLE  = [6, 9, 5, 8, 4, 7, 3]     // B4,E5,A4,D5,G4,C5,F4
// ♯の位置（ヘ音記号）
const SHARP_STEPS_BASS   = [8, 5, 9, 6, 3, 7, 4]     // F3,C3,G3,D3,A2,E3,B2
const FLAT_STEPS_BASS    = [4, 7, 3, 6, 2, 5, 1]     // B2,E3,A2,D3,G2,C3,F2

export default function Staff({ clef, keySignature, notes, width = 560, height = 140 }: Props) {
  const lines = Array.from({ length: STAFF_LINE_COUNT }, (_, i) => i)
  const clefEndX = 72
  const accidentalSpacing = 14

  const sharpSteps = clef === 'treble' ? SHARP_STEPS_TREBLE : SHARP_STEPS_BASS
  const flatSteps  = clef === 'treble' ? FLAT_STEPS_TREBLE  : FLAT_STEPS_BASS

  // 調号記号
  const keySigSymbols: { x: number; y: number; symbol: string }[] = []
  if (keySignature.type === 'sharp') {
    for (let i = 0; i < keySignature.count; i++) {
      keySigSymbols.push({
        x: clefEndX + i * accidentalSpacing,
        y: stepToY(sharpSteps[i], clef),
        symbol: '♯',
      })
    }
  } else if (keySignature.type === 'flat') {
    for (let i = 0; i < keySignature.count; i++) {
      keySigSymbols.push({
        x: clefEndX + i * accidentalSpacing,
        y: stepToY(flatSteps[i], clef),
        symbol: '♭',
      })
    }
  }

  const noteStartX = clefEndX + Math.max(keySignature.count, 1) * accidentalSpacing + 20
  const NOTE_RADIUS = 7

  // 音符描画
  const noteElements = notes.map((note, i) => {
    const step = noteToStep(note.name, note.octave, clef)
    const y = stepToY(step, clef)
    const x = noteStartX + i * 30

    // 加線が必要か
    const ledgerLines: number[] = []
    const topLine = STAFF_TOP
    const botLine = STAFF_TOP + STAFF_HEIGHT
    const halfSpace = LINE_SPACING / 2

    if (y < topLine) {
      for (let ly = topLine - LINE_SPACING; ly >= y - halfSpace; ly -= LINE_SPACING) ledgerLines.push(ly)
    }
    if (y > botLine) {
      for (let ly = botLine + LINE_SPACING; ly <= y + halfSpace; ly += LINE_SPACING) ledgerLines.push(ly)
    }
    // C4（ト音記号中央C）加線
    if (clef === 'treble' && step === 0) ledgerLines.push(y)

    // 調号によるシャープ・フラット
    const sharps = SHARP_ORDER.slice(0, keySignature.type === 'sharp' ? keySignature.count : 0)
    const flats  = FLAT_ORDER.slice(0, keySignature.type === 'flat'  ? keySignature.count : 0)
    let accidental = ''
    if (sharps.includes(note.name as any)) accidental = '♯'
    else if (flats.includes(note.name as any)) accidental = '♭'

    return (
      <g key={i}>
        {/* 加線 */}
        {ledgerLines.map((ly, li) => (
          <line key={li}
            x1={x - NOTE_RADIUS - 4} y1={ly}
            x2={x + NOTE_RADIUS + 4} y2={ly}
            stroke="#222" strokeWidth={1.5}
          />
        ))}
        {/* 臨時記号 */}
        {accidental && (
          <text x={x - NOTE_RADIUS - 8} y={y + 5}
            fontSize={14} fontFamily="serif" fill="#222" textAnchor="middle">
            {accidental}
          </text>
        )}
        {/* 符頭 */}
        <ellipse cx={x} cy={y} rx={NOTE_RADIUS} ry={NOTE_RADIUS * 0.72}
          fill="#222" transform={`rotate(-15, ${x}, ${y})`} />
        {/* 符幹 */}
        <line x1={x + NOTE_RADIUS - 1} y1={y}
              x2={x + NOTE_RADIUS - 1} y2={y - LINE_SPACING * 3}
              stroke="#222" strokeWidth={1.5} />
      </g>
    )
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }}
      aria-label="五線譜">
      {/* 五線 */}
      {lines.map(i => (
        <line key={i}
          x1={14} y1={STAFF_TOP + i * LINE_SPACING}
          x2={width - 14} y2={STAFF_TOP + i * LINE_SPACING}
          stroke="#222" strokeWidth={1.5}
        />
      ))}

      {/* 音部記号 */}
      {clef === 'treble' ? (
        <text x={10} y={STAFF_TOP + STAFF_HEIGHT + 8}
          fontSize={72} fontFamily="serif" fill="#222">𝄞</text>
      ) : (
        <text x={10} y={STAFF_TOP + LINE_SPACING + 4}
          fontSize={40} fontFamily="serif" fill="#222">𝄢</text>
      )}

      {/* 調号 */}
      {keySigSymbols.map((s, i) => (
        <text key={i} x={s.x + 6} y={s.y + 12}
          fontSize={16} fontFamily="serif" fill="#222"
          textAnchor="middle" fontWeight="bold">
          {s.symbol}
        </text>
      ))}

      {/* 音符 */}
      {noteElements}
    </svg>
  )
}
