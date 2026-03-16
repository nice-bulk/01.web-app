import { useState, useEffect } from 'react'
import type { ActiveNote } from '../../hooks/usePlayMode'
import { BEAT_PX, JUDGE_LINE_X } from '../../hooks/usePlayMode'
import styles from './PlayLane.module.css'

const LINE_SPACING = 16
const STAFF_TOP    = 36
const STAFF_LINES  = 5
const STAFF_HEIGHT = (STAFF_LINES - 1) * LINE_SPACING
const NOTE_NAMES   = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BASE_OCTAVE  = 4

function noteToY(noteStr: string): number {
  const name    = noteStr.slice(0, -1)
  const octave  = parseInt(noteStr.slice(-1), 10)
  const baseIdx = NOTE_NAMES.indexOf('C') + BASE_OCTAVE * 7
  const noteIdx = NOTE_NAMES.indexOf(name) + octave * 7
  const step    = noteIdx - baseIdx
  const centerY = STAFF_TOP + LINE_SPACING * 2
  return centerY - (step - 6) * (LINE_SPACING / 2)
}

interface JudgeEffect {
  id: number
  judgment: 'perfect' | 'good'
  y: number
}

interface Props {
  notes: ActiveNote[]
  scrollX: number
  beatMs: number
  width?: number
}

const BAR_H  = LINE_SPACING * 0.78
const LANE_W = 900
const LANE_H = 140

export default function PlayLane({ notes, scrollX, beatMs, width = LANE_W }: Props) {
  const lines = Array.from({ length: STAFF_LINES }, (_, i) => i)

  // 判定エフェクト（短時間表示してフェードアウト）
  const [effects, setEffects] = useState<JudgeEffect[]>([])

  useEffect(() => {
    const freshHits = notes.filter(
      n => n.hit && (n.judgment === 'perfect' || n.judgment === 'good')
    )
    freshHits.forEach(n => {
      setEffects(prev => {
        if (prev.some(e => e.id === n.id)) return prev
        const eff: JudgeEffect = { id: n.id, judgment: n.judgment as 'perfect' | 'good', y: noteToY(n.note) }
        setTimeout(() => setEffects(p => p.filter(e => e.id !== n.id)), 500)
        return [...prev, eff]
      })
    })
  }, [notes])

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${width} ${LANE_H}`}
        width="100%"
        style={{ maxWidth: width }}
        className={styles.svg}
      >
        {/* 五線 */}
        {lines.map(i => (
          <line key={i}
            x1={0} y1={STAFF_TOP + i * LINE_SPACING}
            x2={width} y2={STAFF_TOP + i * LINE_SPACING}
            stroke="#ccc" strokeWidth={1.5}
          />
        ))}

        {/* ト音記号 */}
        <text x={8} y={STAFF_TOP + STAFF_HEIGHT - LINE_SPACING + 8}
          fontSize={72} fontFamily="serif" fill="#bbb">𝄞</text>

        {/* 判定ライン */}
        <line
          x1={JUDGE_LINE_X} y1={STAFF_TOP - 14}
          x2={JUDGE_LINE_X} y2={STAFF_TOP + STAFF_HEIGHT + 14}
          stroke="#4f8ef7" strokeWidth={2.5}
          strokeDasharray="4 3"
          opacity={0.85}
        />
        <circle cx={JUDGE_LINE_X} cy={STAFF_TOP - 16} r={4} fill="#4f8ef7" />
        <circle cx={JUDGE_LINE_X} cy={STAFF_TOP + STAFF_HEIGHT + 16} r={4} fill="#4f8ef7" />

        {/* ノートバー */}
        {notes.map(n => {
          if (n.hit) return null  // ヒット済み（Perfect/Good/Miss）はすべて消す

          const y    = noteToY(n.note)
          const barW = Math.max((n.duration * BEAT_PX) - 4, 8)
          const barX = JUDGE_LINE_X + ((n.hitTime - scrollX) / beatMs) * BEAT_PX

          if (barX + barW < 0 || barX > width) return null

          // 判定ラインに近いほど明るくハイライト
          const dist     = Math.abs(barX - JUDGE_LINE_X)
          const closeRatio = Math.max(0, 1 - dist / 80)

          return (
            <g key={n.id}>
              <rect
                x={barX} y={y - BAR_H / 2}
                width={barW} height={BAR_H}
                rx={BAR_H / 2}
                className={styles.noteBar}
                opacity={0.6 + closeRatio * 0.4}
              />
              <text
                x={barX + Math.min(barW / 2, 20)}
                y={y + 4}
                textAnchor="middle"
                fontSize={9}
                fill="white"
                fontWeight="bold"
                pointerEvents="none"
              >
                {n.note.slice(0, -1)}
              </text>
            </g>
          )
        })}

        {/* 判定エフェクト */}
        {effects.map(e => (
          <text key={`eff-${e.id}`}
            x={JUDGE_LINE_X}
            y={e.y - 14}
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
            className={e.judgment === 'perfect' ? styles.effectPerfect : styles.effectGood}
          >
            {e.judgment === 'perfect' ? 'Perfect!' : 'Good'}
          </text>
        ))}
      </svg>
    </div>
  )
}
