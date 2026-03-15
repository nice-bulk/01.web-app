import type { KeySignature, Note, NoteName, Accidental } from '../types/music'

// ── 定数 ─────────────────────────────────────────────────────
const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

// ♯が付く順番（FCGDAEB）
export const SHARP_ORDER: NoteName[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
// ♭が付く順番（BEADGCF）
export const FLAT_ORDER: NoteName[]  = ['B', 'E', 'A', 'D', 'G', 'C', 'F']

// ── 調号データ ────────────────────────────────────────────────
export const KEY_SIGNATURES: KeySignature[] = [
  { type: 'none',  count: 0, majorKey: 'C Major',  minorKey: 'A Minor' },
  { type: 'sharp', count: 1, majorKey: 'G Major',  minorKey: 'E Minor' },
  { type: 'sharp', count: 2, majorKey: 'D Major',  minorKey: 'B Minor' },
  { type: 'sharp', count: 3, majorKey: 'A Major',  minorKey: 'F# Minor' },
  { type: 'sharp', count: 4, majorKey: 'E Major',  minorKey: 'C# Minor' },
  { type: 'sharp', count: 5, majorKey: 'B Major',  minorKey: 'G# Minor' },
  { type: 'sharp', count: 6, majorKey: 'F# Major', minorKey: 'D# Minor' },
  { type: 'sharp', count: 7, majorKey: 'C# Major', minorKey: 'A# Minor' },
  { type: 'flat',  count: 1, majorKey: 'F Major',  minorKey: 'D Minor' },
  { type: 'flat',  count: 2, majorKey: 'Bb Major',  minorKey: 'G Minor' },
  { type: 'flat',  count: 3, majorKey: 'Eb Major',  minorKey: 'C Minor' },
  { type: 'flat',  count: 4, majorKey: 'Ab Major',  minorKey: 'F Minor' },
  { type: 'flat',  count: 5, majorKey: 'Db Major',  minorKey: 'Bb Minor' },
  { type: 'flat',  count: 6, majorKey: 'Gb Major',  minorKey: 'Eb Minor' },
  { type: 'flat',  count: 7, majorKey: 'Cb Major',  minorKey: 'Ab Minor' },
]

// ── ユーティリティ ────────────────────────────────────────────
function noteIndex(name: NoteName, octave: number): number {
  return octave * 7 + NOTE_NAMES.indexOf(name)
}

function buildNoteRange(
  fromName: NoteName, fromOctave: number,
  toName: NoteName, toOctave: number,
): Note[] {
  const result: Note[] = []
  const start = noteIndex(fromName, fromOctave)
  const end   = noteIndex(toName, toOctave)
  for (let i = start; i <= end; i++) {
    result.push({ name: NOTE_NAMES[i % 7], octave: Math.floor(i / 7) })
  }
  return result
}

// ── 音域定義 ──────────────────────────────────────────────────
// トレブル譜: C4〜G5（加線1本まで）
export const TREBLE_NOTES: Note[] = buildNoteRange('C', 4, 'G', 5)
// バス譜: E2〜C4（加線1本まで）
export const BASS_NOTES: Note[] = buildNoteRange('E', 2, 'C', 4)

/**
 * 調号を考慮して、音符に付く臨時記号を解決する。
 */
export function resolveAccidental(note: Note, keySig: KeySignature): Accidental | undefined {
  if (keySig.type === 'sharp') {
    const sharps = SHARP_ORDER.slice(0, keySig.count)
    if (sharps.includes(note.name)) return 'sharp'
  } else if (keySig.type === 'flat') {
    const flats = FLAT_ORDER.slice(0, keySig.count)
    if (flats.includes(note.name)) return 'flat'
  }
  return undefined
}

/**
 * ランダムに1要素を取得
 */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
