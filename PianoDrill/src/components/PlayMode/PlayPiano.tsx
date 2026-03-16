import styles from './PlayPiano.module.css'

interface Props {
  onPress: (note: string) => void
  activeNotes: Set<string>  // 現在押されているキー（視覚的ハイライト用）
}

const WHITE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// Play Mode は C4〜B5 の2オクターブ
const OCTAVES = [4, 5]
const HAS_BLACK: Record<string, boolean> = { C: true, D: true, F: true, G: true, A: true }

const WHITE_W = 40
const WHITE_H = 110
const BLACK_W = 26
const BLACK_H = 68

export default function PlayPiano({ onPress, activeNotes }: Props) {
  const whiteKeys: React.ReactElement[] = []
  const blackKeys: React.ReactElement[] = []
  let wi = 0

  for (const octave of OCTAVES) {
    for (const name of WHITE_NAMES) {
      const noteStr = `${name}${octave}`
      const x       = wi * WHITE_W
      const active  = activeNotes.has(noteStr)

      whiteKeys.push(
        <g key={noteStr} onClick={() => onPress(noteStr)} style={{ cursor: 'pointer' }}>
          <rect
            x={x} y={0} width={WHITE_W - 1} height={WHITE_H} rx={3}
            className={`${styles.whiteKey} ${active ? styles.whiteActive : ''}`}
          />
          <text
            x={x + WHITE_W / 2} y={WHITE_H - 10}
            textAnchor="middle" fontSize={9}
            className={styles.keyLabel}
          >
            {name}{octave}
          </text>
        </g>
      )

      if (HAS_BLACK[name]) {
        const bx      = x + WHITE_W - BLACK_W / 2
        const bNote   = `${name}#${octave}`
        const bActive = activeNotes.has(bNote)
        blackKeys.push(
          <rect key={bNote}
            x={bx} y={0} width={BLACK_W} height={BLACK_H} rx={2}
            className={`${styles.blackKey} ${bActive ? styles.blackActive : ''}`}
          />
        )
      }
      wi++
    }
  }

  const svgW = wi * WHITE_W

  return (
    <div className={styles.wrapper}>
      <svg viewBox={`0 0 ${svgW} ${WHITE_H}`} width="100%"
        style={{ maxWidth: svgW, display: 'block' }}>
        {whiteKeys}
        {blackKeys}
      </svg>
    </div>
  )
}
