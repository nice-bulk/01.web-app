import type { ScoreState } from '../../hooks/useScore'
import type { Lang } from '../../context/AppContext'
import { t } from '../../utils/localize'
import styles from './TimeUpModal.module.css'

interface Props {
  score: ScoreState
  accuracy: number | null
  lang: Lang
  onRestart: () => void
  onBack: () => void
}

function getMessageKey(accuracy: number | null) {
  if (accuracy === null || accuracy < 40) return 'timeUp.message.keep'    as const
  if (accuracy < 60)                       return 'timeUp.message.ok'      as const
  if (accuracy < 80)                       return 'timeUp.message.good'    as const
  if (accuracy < 95)                       return 'timeUp.message.great'   as const
  return                                          'timeUp.message.perfect' as const
}

export default function TimeUpModal({ score, accuracy, lang, onRestart, onBack }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>⏱ Time!</h2>
        <p className={styles.message}>{t(getMessageKey(accuracy), lang)}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{score.total}</span>
            <span className={styles.statLabel}>{t('timeUp.questions', lang)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {accuracy === null ? '–' : `${accuracy}%`}
            </span>
            <span className={styles.statLabel}>{t('timeUp.accuracy', lang)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{score.bestStreak}</span>
            <span className={styles.statLabel}>{t('timeUp.bestStreak', lang)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.restart} onClick={onRestart}>{t('timeUp.restart', lang)}</button>
          <button className={styles.back} onClick={onBack}>{t('timeUp.back', lang)}</button>
        </div>
      </div>
    </div>
  )
}
