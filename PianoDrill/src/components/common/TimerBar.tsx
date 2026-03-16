import styles from './TimerBar.module.css'

interface Props {
  remaining: number
  total: number
}

export default function TimerBar({ remaining, total }: Props) {
  const pct = (remaining / total) * 100
  const urgent = remaining <= 10

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.bar} ${urgent ? styles.urgent : ''}`}
        style={{ width: `${pct}%` }}
      />
      <span className={`${styles.label} ${urgent ? styles.urgentLabel : ''}`}>
        {remaining}s
      </span>
    </div>
  )
}
