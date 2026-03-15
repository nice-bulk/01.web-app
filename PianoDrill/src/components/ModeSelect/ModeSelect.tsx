import type { AppMode } from '../../types/music'
import styles from './ModeSelect.module.css'

interface Props {
  onSelect: (mode: AppMode) => void
}

export default function ModeSelect({ onSelect }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎹 PianoDrill</h1>
      <p className={styles.subtitle}>練習するモードを選んでください</p>
      <div className={styles.cards}>
        <button className={styles.card} onClick={() => onSelect('note')}>
          <span className={styles.icon}>🎼</span>
          <h2>Note Mode</h2>
          <p>音符を見て鍵盤を当てる</p>
        </button>
        <button className={styles.card} onClick={() => onSelect('key')}>
          <span className={styles.icon}>🔑</span>
          <h2>Key Mode</h2>
          <p>調号を見て何調かを当てる</p>
        </button>
      </div>
    </div>
  )
}
