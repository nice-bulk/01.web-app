import type { Lang } from '../../context/AppContext'
import styles from './PlayResult.module.css'

interface Props {
  results: { perfect: number; good: number; miss: number }
  songTitle: string
  lang: Lang
  onReplay: () => void
  onBack: () => void
}

function getRank(accuracy: number): string {
  if (accuracy >= 95) return 'S'
  if (accuracy >= 80) return 'A'
  if (accuracy >= 60) return 'B'
  if (accuracy >= 40) return 'C'
  return 'D'
}

function getMessage(accuracy: number, lang: Lang): string {
  const en = accuracy >= 95 ? 'Perfect performance! 🏆'
    : accuracy >= 80 ? 'Great job! 🔥'
    : accuracy >= 60 ? 'Nice! Keep it up 🎶'
    : accuracy >= 40 ? 'Getting there! 🎵'
    : 'Keep practicing! 💪'
  const ja = accuracy >= 95 ? 'パーフェクト！🏆'
    : accuracy >= 80 ? 'すごい！🔥'
    : accuracy >= 60 ? 'いい感じ！🎶'
    : accuracy >= 40 ? 'もう少し！🎵'
    : '練習あるのみ！💪'
  return lang === 'en' ? en : ja
}

export default function PlayResult({ results, songTitle, lang, onReplay, onBack }: Props) {
  const total    = results.perfect + results.good + results.miss
  const accuracy = total === 0 ? 0 : Math.round(((results.perfect + results.good) / total) * 100)
  const rank     = getRank(accuracy)

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.songTitle}>{songTitle}</p>
        <div className={`${styles.rank} ${styles[`rank${rank}`]}`}>{rank}</div>
        <p className={styles.message}>{getMessage(accuracy, lang)}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: '#f59e0b' }}>{results.perfect}</span>
            <span className={styles.statLabel}>Perfect</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: '#10b981' }}>{results.good}</span>
            <span className={styles.statLabel}>Good</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: '#ef4444' }}>{results.miss}</span>
            <span className={styles.statLabel}>Miss</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{accuracy}%</span>
            <span className={styles.statLabel}>{lang === 'en' ? 'Accuracy' : '正解率'}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.replay} onClick={onReplay}>
            {lang === 'en' ? 'Play Again 🔄' : 'もう一度 🔄'}
          </button>
          <button className={styles.back} onClick={onBack}>
            {lang === 'en' ? 'Back to Menu' : 'モード選択へ'}
          </button>
        </div>
      </div>
    </div>
  )
}
