import type { Note, KeySignature, Clef, NoteName } from '../../types/music'
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
const STAFF_HEIGHT = (STAFF_LINE_COUNT - 1) * LINE_SPACING

const TREBLE_BASE = { name: 'C', octave: 4 }
const BASS_BASE   = { name: 'E', octave: 2 }
const NOTE_NAMES  = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

function noteToStep(name: string, octave: number, clef: Clef): number {
  const base = clef === 'treble' ? TREBLE_BASE : BASS_BASE
  const baseIdx = NOTE_NAMES.indexOf(base.name) + base.octave * 7
  const noteIdx = NOTE_NAMES.indexOf(name) + octave * 7
  return noteIdx - baseIdx
}

function stepToY(step: number): number {
  // step6=B4=第3線 を基準にする
  const centerStep = 6
  const centerY = STAFF_TOP + LINE_SPACING * 2
  return centerY - (step - centerStep) * (LINE_SPACING / 2)
}

const SHARP_STEPS_TREBLE = [10, 7, 11, 8, 5, 9, 6]
const FLAT_STEPS_TREBLE  = [6, 9, 5, 8, 4, 7, 3]
const SHARP_STEPS_BASS   = [8, 5, 9, 6, 3, 7, 4]
const FLAT_STEPS_BASS    = [4, 7, 3, 6, 2, 5, 1]

export default function Staff({ clef, keySignature, notes, width = 560, height = 140 }: Props) {
  const lines = Array.from({ length: STAFF_LINE_COUNT }, (_, i) => i)
  const clefEndX = 72
  const accidentalSpacing = 14

  const sharpSteps = clef === 'treble' ? SHARP_STEPS_TREBLE : SHARP_STEPS_BASS
  const flatSteps  = clef === 'treble' ? FLAT_STEPS_TREBLE  : FLAT_STEPS_BASS

  const keySigSymbols: { x: number; y: number; symbol: string }[] = []
  if (keySignature.type === 'sharp') {
    for (let i = 0; i < keySignature.count; i++) {
      keySigSymbols.push({ x: clefEndX + i * accidentalSpacing, y: stepToY(sharpSteps[i]), symbol: '♯' })
    }
  } else if (keySignature.type === 'flat') {
    for (let i = 0; i < keySignature.count; i++) {
      keySigSymbols.push({ x: clefEndX + i * accidentalSpacing, y: stepToY(flatSteps[i]), symbol: '♭' })
    }
  }

  const noteStartX = clefEndX + Math.max(keySignature.count, 1) * accidentalSpacing + 20
  const NOTE_RADIUS = 7

  const noteElements = notes.map((note, i) => {
    const step = noteToStep(note.name, note.octave, clef)
    const y = stepToY(step)
    const x = noteStartX + i * 30

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
    if (clef === 'treble' && step === 0) ledgerLines.push(y)

    const sharps = SHARP_ORDER.slice(0, keySignature.type === 'sharp' ? keySignature.count : 0)
    const flats  = FLAT_ORDER.slice(0,  keySignature.type === 'flat'  ? keySignature.count : 0)
    let accidental = ''
    if (sharps.includes(note.name as NoteName)) accidental = '♯'
    else if (flats.includes(note.name as NoteName)) accidental = '♭'

    return (
      <g key={i}>
        {ledgerLines.map((ly, li) => (
          <line key={li}
            x1={x - NOTE_RADIUS - 4} y1={ly}
            x2={x + NOTE_RADIUS + 4} y2={ly}
            stroke="#222" strokeWidth={1.5}
          />
        ))}
        {accidental && (
          <text x={x - NOTE_RADIUS - 8} y={y + 5}
            fontSize={14} fontFamily="serif" fill="#222" textAnchor="middle">
            {accidental}
          </text>
        )}
        <ellipse cx={x} cy={y} rx={NOTE_RADIUS} ry={NOTE_RADIUS * 0.72}
          fill="#222" transform={`rotate(-15, ${x}, ${y})`} />
        <line x1={x + NOTE_RADIUS - 1} y1={y}
              x2={x + NOTE_RADIUS - 1} y2={y - LINE_SPACING * 3}
              stroke="#222" strokeWidth={1.5} />
      </g>
    )
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }} aria-label="五線譜">
      {lines.map(i => (
        <line key={i}
          x1={14} y1={STAFF_TOP + i * LINE_SPACING}
          x2={width - 14} y2={STAFF_TOP + i * LINE_SPACING}
          stroke="#222" strokeWidth={1.5}
        />
      ))}
      {clef === 'treble' ? (
        <text x={10} y={STAFF_TOP + STAFF_HEIGHT - LINE_SPACING + 8} fontSize={72} fontFamily="serif" fill="#222">𝄞</text>
      ) : (
        <text x={10} y={STAFF_TOP + LINE_SPACING + 4} fontSize={40} fontFamily="serif" fill="#222">𝄢</text>
      )}
      {keySigSymbols.map((s, i) => (
        <text key={i} x={s.x + 6} y={s.y + 12}
          fontSize={16} fontFamily="serif" fill="#222" textAnchor="middle" fontWeight="bold">
          {s.symbol}
        </text>
      ))}
      {noteElements}
    </svg>
  )
}
