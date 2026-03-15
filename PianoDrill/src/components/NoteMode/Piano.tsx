import type { Note, Clef } from '../../types/music'
import { TREBLE_NOTES, BASS_NOTES } from '../../data/music'
import styles from './Piano.module.css'

interface Props {
  clef: Clef
  mode: 'single' | 'chord'
  selected: Note[]
  answered: boolean
  correctNotes: Note[]
  onPress: (note: Note) => void
}

// 1オクターブの鍵盤レイアウト
// white keys: C D E F G A B
// black keys: C# D# F# G# A#
const WHITE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_POSITIONS: Record<string, number> = {
  'C#': 0.6, 'D#': 1.6, 'F#': 3.6, 'G#': 4.6, 'A#': 5.6,
}

function isBlack(name: string): boolean {
  return name.includes('#') || name.includes('b')
}

function noteId(note: Note): string {
  return `${note.name}${note.octave}`
}

export default function Piano({ clef, mode, selected, answered, correctNotes, onPress }: Props) {
  const notePool = clef === 'treble' ? TREBLE_NOTES : BASS_NOTES

  // 音域の最小・最大オクターブ
  const octaves = [...new Set(notePool.map(n => n.octave))].sort()

  const WHITE_KEY_W = 36
  const WHITE_KEY_H = 100
  const BLACK_KEY_W = 24
  const BLACK_KEY_H = 62

  const selectedIds = new Set(selected.map(noteId))
  const correctIds  = new Set(correctNotes.map(noteId))

  const keys: JSX.Element[] = []
  let whiteIndex = 0

  for (const octave of octaves) {
    for (const name of WHITE_NAMES) {
      const note: Note = { name: name as any, octave }
      const inRange = notePool.some(n => n.name === note.name && n.octave === note.octave)
      if (!inRange) { whiteIndex++; continue }

      const x = whiteIndex * WHITE_KEY_W
      const id = noteId(note)
      const isSelected = selectedIds.has(id)
      const isCorrect  = answered && correctIds.has(id)
      const isWrong    = answered && isSelected && !isCorrect

      keys.push(
        <rect key={id}
          x={x} y={0} width={WHITE_KEY_W - 1} height={WHITE_KEY_H}
          rx={3}
          className={`${styles.whiteKey}
            ${isCorrect ? styles.correct : ''}
            ${isWrong   ? styles.wrong   : ''}
            ${isSelected && !answered ? styles.selected : ''}`}
          onClick={() => !answered && onPress(note)}
        />,
      )
      whiteIndex++
    }
  }

  // 黒鍵は白鍵の上に重ねて描画
  let whiteIdx2 = 0
  for (const octave of octaves) {
    for (const name of WHITE_NAMES) {
      const note: Note = { name: name as any, octave }
      const inRange = notePool.some(n => n.name === note.name && n.octave === note.octave)
      if (!inRange) { whiteIdx2++; continue }

      // この白鍵の右隣に黒鍵があるか（C→C#, D→D#, F→F#, G→G#, A→A#）
      const blackName = name + '#'
      const blackPositions: Record<string, boolean> = { C: true, D: true, F: true, G: true, A: true }
      if (blackPositions[name]) {
        const bNote: Note = { name: blackName as any, octave }
        // 黒鍵は音域に含まれないが視覚的に表示（クリック不可）
        const bx = whiteIdx2 * WHITE_KEY_W + WHITE_KEY_W - BLACK_KEY_W / 2
        keys.push(
          <rect key={`${blackName}${octave}`}
            x={bx} y={0} width={BLACK_KEY_W} height={BLACK_KEY_H}
            rx={2}
            className={styles.blackKey}
          />,
        )
      }
      whiteIdx2++
    }
  }

  const totalWhite = whiteIndex
  const svgWidth = totalWhite * WHITE_KEY_W

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${svgWidth} ${WHITE_KEY_H}`}
        width="100%"
        style={{ maxWidth: svgWidth, display: 'block' }}
      >
        {keys}
      </svg>
    </div>
  )
}
