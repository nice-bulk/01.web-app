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

const WHITE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

function noteId(note: Note): string {
  return `${note.name}${note.octave}`
}

export default function Piano({ clef, mode, selected, answered, correctNotes, onPress }: Props) {
  const notePool = clef === 'treble' ? TREBLE_NOTES : BASS_NOTES

  const octaves = [...new Set(notePool.map(n => n.octave))].sort()

  const WHITE_KEY_W = 36
  const WHITE_KEY_H = 100
  const BLACK_KEY_W = 24
  const BLACK_KEY_H = 62

  const selectedIds = new Set(selected.map(noteId))
  const correctIds  = new Set(correctNotes.map(noteId))

  const whiteKeys: React.ReactElement[] = []
  const blackKeys: React.ReactElement[] = []
  let whiteIndex = 0

  for (const octave of octaves) {
    for (const name of WHITE_NAMES) {
      const note: Note = { name: name as Note['name'], octave }
      const inRange = notePool.some(n => n.name === note.name && n.octave === note.octave)

      if (inRange) {
        const x = whiteIndex * WHITE_KEY_W
        const id = noteId(note)
        const isSelected = selectedIds.has(id)
        const isCorrect  = answered && correctIds.has(id)
        const isWrong    = answered && isSelected && !isCorrect

        whiteKeys.push(
          <rect key={id}
            x={x} y={0} width={WHITE_KEY_W - 1} height={WHITE_KEY_H}
            rx={3}
            className={[
              styles.whiteKey,
              isCorrect ? styles.correct : '',
              isWrong   ? styles.wrong   : '',
              isSelected && !answered ? styles.selected : '',
            ].join(' ')}
            onClick={() => !answered && onPress(note)}
          />,
        )
      }

      // 黒鍵（視覚のみ、クリック不可）
      const hasBlack: Record<string, boolean> = { C: true, D: true, F: true, G: true, A: true }
      if (hasBlack[name]) {
        const bx = whiteIndex * WHITE_KEY_W + WHITE_KEY_W - BLACK_KEY_W / 2
        blackKeys.push(
          <rect key={`${name}#${octave}`}
            x={bx} y={0} width={BLACK_KEY_W} height={BLACK_KEY_H}
            rx={2}
            className={styles.blackKey}
          />,
        )
      }

      whiteIndex++
    }
  }

  const svgWidth = whiteIndex * WHITE_KEY_W

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${svgWidth} ${WHITE_KEY_H}`}
        width="100%"
        style={{ maxWidth: svgWidth, display: 'block' }}
      >
        {whiteKeys}
        {blackKeys}
      </svg>
    </div>
  )
}
