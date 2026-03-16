import { getLogs } from '../../hooks/usePracticeLog'
import styles from './PracticeLogChart.module.css'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function PracticeLogChart() {
  const logs = getLogs()

  if (logs.length === 0) {
    return (
      <div className={styles.empty}>
        <span>📊</span>
        <p>練習ログはまだありません</p>
      </div>
    )
  }

  const maxTotal = Math.max(...logs.map(l => l.total), 1)

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>📊 直近7日の練習ログ</h3>
      <div className={styles.chart}>
        {logs.map(log => {
          const accuracy = log.total > 0 ? Math.round((log.correct / log.total) * 100) : 0
          const barH = Math.max((log.total / maxTotal) * 100, 4)
          return (
            <div key={log.date} className={styles.col}>
              <div className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{ height: `${barH}%` }}
                  title={`${log.total}問 / 正解率 ${accuracy}%`}
                >
                  <span className={styles.barLabel}>{accuracy}%</span>
                </div>
              </div>
              <span className={styles.dateLabel}>{formatDate(log.date)}</span>
              <span className={styles.totalLabel}>{log.total}問</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
