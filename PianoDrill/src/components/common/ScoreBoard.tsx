import type { ScoreState } from '../../hooks/useScore'
import styles from './ScoreBoard.module.css'

interface Props {
  score: ScoreState
  accuracy: number | null
}

export default function ScoreBoard({ score, accuracy }: Props) {
  return (
    <div className={styles.board}>
      <div className={styles.item}>
        <span className={styles.label}>正解率</span>
        <span className={styles.value}>
          {accuracy === null ? '–' : `${accuracy}%`}
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.label}>連続正解</span>
        <span className={`${styles.value} ${score.streak >= 5 ? styles.hot : ''}`}>
          {score.streak}
          {score.streak >= 5 && <span className={styles.fire}>🔥</span>}
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.label}>最高連続</span>
        <span className={styles.value}>{score.bestStreak}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.label}>問題数</span>
        <span className={styles.value}>{score.total}</span>
      </div>
    </div>
  )
}
