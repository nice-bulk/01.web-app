import type { ScoreState } from '../../hooks/useScore'
import type { Lang } from '../../context/AppContext'
import { t } from '../../utils/localize'
import styles from './ScoreBoard.module.css'

interface Props {
  score: ScoreState
  accuracy: number | null
  lang: Lang
}

export default function ScoreBoard({ score, accuracy, lang }: Props) {
  return (
    <div className={styles.board}>
      <div className={styles.item}>
        <span className={styles.label}>{t('score.accuracy', lang)}</span>
        <span className={styles.value}>
          {accuracy === null ? '–' : `${accuracy}%`}
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.label}>{t('score.streak', lang)}</span>
        <span className={`${styles.value} ${score.streak >= 5 ? styles.hot : ''}`}>
          {score.streak}
          {score.streak >= 5 && <span className={styles.fire}>🔥</span>}
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.label}>{t('score.bestStreak', lang)}</span>
        <span className={styles.value}>{score.bestStreak}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.label}>{t('score.total', lang)}</span>
        <span className={styles.value}>{score.total}</span>
      </div>
    </div>
  )
}
